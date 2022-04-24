import ExprStatement from "./ast/statement/expr.statement";
import { TokenType, Token } from "./lexer";
import { Statement, Expression, Accessible } from "./node";

import { 
    ArrayAccessExpression,
    BinaryExpression,
    ConditionalExpression,
    FieldAccessExpression,
    InvokeExpression,
    NumberExpression,
    StringExpression,
    TernaryExpression,
    UnaryExpression,
    VariableExpression,
    ArrayExpression,
    BooleanExpression,
    ConditionExpression
  } from './ast/expression'

import { 
    AssignmentStatement, 
    Block,
    BreakStatement, 
    ContinueStatement, 
    ErrorStatement, 
    ForStatement, 
    IfElseStatement, 
    RepeatStatement, 
    ReturnStatement, 
    VarDeclarationStatement 
} from "./ast/statement";
import Program from "./ast/program";

const assignmentOperators = [
    TokenType.ASSIGN,
    TokenType.PLUS_EQ,
    TokenType.MINUS_EQ,
    TokenType.MUL_EQ,
    TokenType.DIV_EQ,
    TokenType.MOD_EQ
]

const types = [
    TokenType.NULL_TYPE,
    TokenType.BOOLEAN_TYPE,
    TokenType.NUMBER_TYPE,
    TokenType.STRING_TYPE,
    TokenType.FUNCTION_TYPE,
    TokenType.OBJECT_TYPE,
    TokenType.ARRAY_TYPE
]

export default class Parser {

    private pos = 0
    private readonly size: number

    constructor(private tokens: Token[]) {
        this.size = tokens.length
    }

    parse() : Program {
        let statements: Statement[] = []

        while(true) {
            try {
                statements.push(this.statement())
            }
            catch (e) {
                if (e instanceof EOF) {
                    break
                }
                else {
                    throw e
                }
            }
        }
        return new Program(statements)
    }

    private statement(): Statement {
        if (this.match(TokenType.LET)) {
            return this.varDeclaration({ isConst: false })
        }
        if (this.match(TokenType.CONST)) {
            return this.varDeclaration({ isConst: true })
        }
        if (this.match(TokenType.REPEAT)) {
            return this.repeat()
        }
        if (this.match(TokenType.FOR)) {
            return this.forLoop()
        }
        if (this.match(TokenType.IF)) {
            return this.ifElse()
        }
        if (this.match(TokenType.RETURN)) {
            return new ReturnStatement(this.expression())
        }
        if (this.match(TokenType.ERROR)) {
            return new ErrorStatement(this.expression())
        }
        if (this.match(TokenType.BREAK)) {
            return new BreakStatement(this.last())
        }
        if (this.match(TokenType.CONTINUE)) {
            return new ContinueStatement(this.last())
        }

        let variable = this.expression()
        
        if (this.hasNext(0)) {
            let current = this.current()

            if (assignmentOperators.includes(current.type)) {

                if (variable instanceof Accessible) {
                    this.consume(current.type)
                    return new AssignmentStatement(variable, this.expression(), current.type)
                }
                else {
                    throw new Error(`Cannot assign to ${variable}`)
                }
            }
        }
        return new ExprStatement(variable)
    }

    private varDeclaration(options: { isConst: boolean }): Statement {
        let identifier = this.consume(TokenType.IDENTIFIER)
        this.consume(TokenType.COLON)
        let current = this.current()
        if (!types.includes(current.type)) {
            throw new Error(`Expected type, got ${current.type}`)
        }
        this.consume(current.type)
        let type = current
        this.consume(TokenType.ASSIGN)
        let value = this.expression()
        return new VarDeclarationStatement(identifier, type, value, options.isConst)
    }

    private repeat(): Statement {
        
        let count: Expression | undefined
        if (this.match(TokenType.LPAREN)) {
            count = this.expressionInParen()
        }
        let block = this.statementOrBlock()
        return new RepeatStatement(count, block)
    }

    private forLoop(): Statement {
        let variable = this.consume(TokenType.IDENTIFIER)
        this.consume(TokenType.ASSIGN)
        let start = this.expression()
        this.consume(TokenType.TO)
        let end = this.expression()
        let step = this.match(TokenType.STEP) ? this.expression() : undefined
        let block = this.statementOrBlock()
        return new ForStatement(variable, start, end, step, block)
    }

    private ifElse(): Statement {
        let condition = new ConditionExpression(this.expression())
        let trueBlock = this.statementOrBlock()

        return this.match(TokenType.ELSE) 
            ? new IfElseStatement(condition, trueBlock, this.statementOrBlock()) 
            : new IfElseStatement(condition, trueBlock)
    }

    private statementOrBlock(): Statement {
        return (this.lookMatch(0, TokenType.LBRACE)) ? this.block() : this.statement()
    }

    private block(): Block {
        let statements: Statement[] = []
        this.consume(TokenType.LBRACE)
        while (!this.match(TokenType.RBRACE)) {
            statements.push(this.statement())
        } 
        return new Block(statements)
    }

    private expression(): Expression {
        return this.variableSuffix(this.ternary())
    }

    private ternary(): Expression {
        let result = this.logicalOr()

        if (this.match(TokenType.QUESTION)) {

            let trueExpr = this.expression()
            this.consume(TokenType.COLON)
            let falseExpr = this.expression()

            return new TernaryExpression(result, trueExpr, falseExpr)
        }
        return result
    }

    private logicalOr(): Expression {
        let result = this.logicalAnd()
        while (true) {
            if (this.match(TokenType.OR)) {
                result = new BinaryExpression(result, this.logicalAnd(), TokenType.OR)
                continue
            }
            break
        }
        return result
    }
    
    private logicalAnd(): Expression {
        var result = this.equality()
        while (true) {
            if (this.match(TokenType.AND)) {
                result = new BinaryExpression(result, this.equality(), TokenType.AND)
                continue
            }
            break
        }
        return result
    }
    
    private equality(): Expression {

        let result = this.conditional()

        if (this.match(TokenType.EQ)) {
            return new ConditionalExpression(result, this.conditional(), TokenType.EQ)
        }
        else if (this.match(TokenType.NEQ)) {
            return new ConditionalExpression(result, this.conditional(), TokenType.NEQ)
        }
        else return result
    }

    private conditional(): Expression {
        let result = this.additive()
        while(true) {
            if (this.match(TokenType.LT)) {
                result = new ConditionalExpression(result, this.additive(), TokenType.LT)
                continue
            }
            if (this.match(TokenType.GT)) {
                result = new ConditionalExpression(result, this.additive(), TokenType.GT)
                continue
            }
            if (this.match(TokenType.LEQ)) {
                result = new ConditionalExpression(result, this.additive(), TokenType.LEQ)
                continue
            }
            if (this.match(TokenType.GEQ)) {
                result = new ConditionalExpression(result, this.additive(), TokenType.GEQ)
                continue
            }
            break
        }
        return result
    }

    private additive(): Expression {
        let result = this.multiplicative()

        while (true) {
            if (this.match(TokenType.PLUS)) {
                result = new BinaryExpression(result, this.multiplicative(), TokenType.PLUS)
                continue
            }
            if (this.match(TokenType.MINUS)) {
                result = new BinaryExpression(result, this.multiplicative(), TokenType.MINUS)
                continue
            }
            break
        }
        return result
    }

    private multiplicative(): Expression {
        let result = this.unary()
        while (true) {
            if (this.match(TokenType.MUL)) {
                result = new BinaryExpression(result, this.unary(), TokenType.MUL)
                continue
            }
            if (this.match(TokenType.DIV)) {
                result = new BinaryExpression(result, this.unary(), TokenType.DIV)
                continue
            }
            if (this.match(TokenType.MOD)) {
                result = new BinaryExpression(result, this.unary(), TokenType.MOD)
                continue
            }
            break
        }
        return result
    }

    private unary(): Expression {
        if (this.match(TokenType.MINUS)) {
            return new UnaryExpression(this.primary(), TokenType.MINUS)
        }
        if (this.match(TokenType.NOT)) {
            return new UnaryExpression(this.primary(), TokenType.NOT)
        }
        if (this.match(TokenType.PLUS)) {
            return this.primary()
        }
        else {
            return this.primary()
        }
    }

    private primary(): Expression {
        if (this.match(TokenType.LPAREN)) {
            return this.expressionInParen()
        }
        if (this.match(TokenType.LBRACKET)) {
            return this.array()
        }
        else {
            return this.variable()
        }
    }

    private expressionInParen(): Expression {
        let result = this.expression()
        this.consume(TokenType.RPAREN)
        return result
    }

    private array(): Expression {
        let elements: Expression[] = []
        if (!this.match(TokenType.RBRACKET)) {
            while (true) {
                elements.push(this.expression())
                // after expression must be ] or comma
                if (this.match(TokenType.RBRACKET)) break
                this.consume(TokenType.COMMA)
            }
        }
        return new ArrayExpression(elements)
    }

    private variableSuffix(expression: Expression): Expression {
        var result: Expression = expression

        while (true) {
                if (this.lookMatch(0, TokenType.LPAREN)) {
                    result = new InvokeExpression(result, this.functionArgs())
                }
                if (this.match(TokenType.DOT) && result instanceof VariableExpression) {
                    // UnknownWordsExpression(mutableListOf(consume(WORD)))
                }
                if (this.match(TokenType.DOT)) {
                    result = new  FieldAccessExpression(result, this.consume(TokenType.IDENTIFIER))
                }
                if (this.match(TokenType.LBRACKET)) {
                    let index = this.expression()
                    this.consume(TokenType.RBRACKET)
                    result = new ArrayAccessExpression(result, index)
                }
                if (this.match(TokenType.INCREMENT)) {
                    result = new UnaryExpression(result, TokenType.INCREMENT)
                }
                if (this.match(TokenType.DECREMENT)) {
                    result = new UnaryExpression(result, TokenType.DECREMENT)
                }
                else {
                    break
                }
            }
        return result
    }

    private variable(): Expression {
        let current = this.current()
        if (this.match(TokenType.IDENTIFIER)) {
            return this.variableSuffix(new VariableExpression(current)) 
        }
        return this.value()
    }

    private functionArgs(): Expression[] {
        let args = []
        this.consume(TokenType.LPAREN)
        if (!this.match(TokenType.RPAREN)) {
            while (true) {
                args.push(this.expression())
                if (this.match(TokenType.RPAREN)) break
                this.consume(TokenType.COMMA)
            }
        }
        return args
    }

    private value(): Expression {
        let current = this.current()
        if (this.match(TokenType.NUMBER)) {
            return new NumberExpression(current)
        }
        if (this.match(TokenType.TRUE) || this.match(TokenType.FALSE)) {
            return new BooleanExpression(current)
        }
        if (this.match(TokenType.STRING)) {
            return new StringExpression(current)
        }
        throw new Error(`Expected value, got ${current.type}`)
    }

    private last(): Token {
        return this.get(-1) 
    }

    private current(): Token {
        return this.get(0)
    }

    private next() {
        this.pos++
    }

    private consume(type: TokenType): Token {
        let current = this.get(0)
        if (current.type === type) {
            this.pos++
            return current
        }
        throw new Error(`Expected ${type}`)
    }

    private match(type: TokenType): boolean {
        if (this.pos >= this.size) {
            return false
        }
        let current = this.get(0)

        if (current.type === type) {
            this.pos++
            return true
        }
        return false
    }

    private lookMatch(relativePos: number, type: TokenType): boolean {
        if (this.pos + relativePos >= this.size) {
            return false
        }
        return this.get(relativePos).type === type
    }

    private hasNext(relativePos: number): boolean {
        let position = this.pos + relativePos
        if (position < 0 || position >= this.size) {
            return false
        }
        return true
    }

    private get(relativePos: number): Token {
        let position = this.pos + relativePos
        if (position < 0 || position >= this.size) {
            throw new EOF()
        }
        return this.tokens[position]
    }
}

class EOF extends Error {
    constructor() {
        super('Unexpected end of file')
    }
}