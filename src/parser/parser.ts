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
import { ParseError } from "./errors";
import { Position } from "./position";
import NamedBlock from "./ast/statement/named.block";

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

    private positionOf(first: Token, second?: Token): Position {
        return new Position(first, second ? second : first)
    }

    private statement(): Statement {

        let current = this.current()

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
            let expression = this.expression()
            return new ReturnStatement(expression, this.positionOf(current))
        }
        if (this.match(TokenType.ERROR)) {
            let expression = this.expression()
            return new ErrorStatement(this.expression(), this.positionOf(current))
        }
        if (this.match(TokenType.BREAK)) {
            return new BreakStatement(current, this.positionOf(current))
        }
        if (this.match(TokenType.CONTINUE)) {
            return new ContinueStatement(current, this.positionOf(current))
        }

        let variable = this.expression()
        
        if (this.hasNext(0)) {
            let current = this.current()

            if (assignmentOperators.includes(current.type)) {

                if (variable instanceof Accessible) {
                    this.consume(current.type)
                    return new AssignmentStatement(variable, this.expression(), current, this.positionOf(current))
                }
                else {
                    console.dir(variable)
                    throw new ParseError('P-1001', current)
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
            throw new ParseError('P-1002', current, [current.type])
        }
        this.consume(current.type)
        let type = current
        this.consume(TokenType.ASSIGN)
        let value = this.expression()
        return new VarDeclarationStatement(identifier, type, value, options.isConst, this.positionOf(identifier, type))
    }

    private repeat(): Statement {
        let position = this.positionOf(this.current())
        let count: Expression | undefined
        if (this.match(TokenType.LPAREN)) {
            count = this.expressionInParen()
        }
        let block = this.statementOrBlock()
        return new RepeatStatement(count, block, position)
    }

    private forLoop(): Statement {
        let token = this.current()
        let variable = this.consume(TokenType.IDENTIFIER)
        this.consume(TokenType.ASSIGN)
        let start = this.expression()
        let varDeclaration = new VarDeclarationStatement(variable, new Token('', TokenType.NUMBER), start, false, this.positionOf(variable))
        this.consume(TokenType.TO)
        let end = this.expression()
        let step = this.match(TokenType.STEP) ? this.expression() : undefined
        let block = this.statementOrBlock()
        return new ForStatement(varDeclaration, start, end, step, block, this.positionOf(token))
    }

    private ifElse(): Statement {
        let token = this.current()

        let condition = new ConditionExpression(this.expression())
        let trueBlock = this.statementOrBlock()
        
        let current = this.current()
        let elseBlock = 
            this.match(TokenType.ELSE) ? new NamedBlock(this.statementOrBlock(), current) : undefined

        return new IfElseStatement(condition, trueBlock, elseBlock, this.positionOf(token))
    }

    private statementOrBlock(): Statement {
        return (this.lookMatch(0, TokenType.LBRACE)) ? this.block() : this.statement()
    }

    private block(): Block {
        let statements: Statement[] = []
        let start = this.consume(TokenType.LBRACE)
        while (!this.lookMatch(0, TokenType.RBRACE)) {
            statements.push(this.statement())
        } 
        let end = this.consume(TokenType.RBRACE)
        return new Block(statements, this.positionOf(start, end))
    }

    private expression(): Expression {
        return this.variableSuffix(this.ternary())
    }

    private ternary(): Expression {
        let result = this.logicalOr()

        if (this.match(TokenType.QUESTION)) {

            let start = this.last()

            let trueExpr = this.expression()
            let end = this.consume(TokenType.COLON)
            let falseExpr = this.expression()


            return new TernaryExpression(result, trueExpr, falseExpr, new Position(start, end))
        }
        return result
    }

    private logicalOr(): Expression {
        let result = this.logicalAnd()
        while (true) {
            if (this.match(TokenType.OR)) {
                result = new BinaryExpression(result, this.logicalAnd(), this.last())
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
                result = new BinaryExpression(result, this.equality(), this.last())
                continue
            }
            break
        }
        return result
    }
    
    private equality(): Expression {

        let result = this.conditional()

        if (this.match(TokenType.EQ) || this.match(TokenType.NEQ)) {
            return new ConditionalExpression(result, this.conditional(), this.last())
        }
        else return result
    }

    private conditional(): Expression {
        let result = this.additive()
        while(true) {
            if (this.match(TokenType.LT) || this.match(TokenType.GT) || this.match(TokenType.LEQ) || this.match(TokenType.GEQ)) {
                result = new ConditionalExpression(result, this.additive(), this.last())
                continue
            }
            break
        }
        return result
    }

    private additive(): Expression {
        let result = this.multiplicative()

        while (true) {
            if (this.match(TokenType.PLUS) || this.match(TokenType.MINUS)) {
                result = new BinaryExpression(result, this.multiplicative(), this.last())
                continue
            }
            break
        }
        return result
    }

    private multiplicative(): Expression {
        let result = this.unary()
        while (true) {
            if (this.match(TokenType.MUL) || this.match(TokenType.DIV) || this.match(TokenType.MOD)) {
                result = new BinaryExpression(result, this.unary(), this.last())
                continue
            }
            break
        }
        return result
    }

    private unary(): Expression {
        if (this.match(TokenType.MINUS) || this.match(TokenType.NOT)) {
            return new UnaryExpression(this.primary(), this.last())
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
        let start = this.last()
        if (!this.match(TokenType.RBRACKET)) {
            while (true) {
                elements.push(this.expression())
                // after expression must be ] or comma
                if (this.match(TokenType.RBRACKET)) break
                this.consume(TokenType.COMMA)
            }
        }
        let end = this.last()
        return new ArrayExpression(elements, new Position(start, end))
    }

    private variableSuffix(expression: Expression): Expression {
        var result: Expression = expression

        while (true) {
            let current = this.current()
            if (this.lookMatch(0, TokenType.LPAREN)) {
                let start = this.current()
                let args = this.functionArgs()
                let end = this.last()
                result = new InvokeExpression(result, args, new Position(start, end))
            }
            if (this.match(TokenType.DOT) && result instanceof VariableExpression) {
                // UnknownWordsExpression(mutableListOf(consume(WORD)))
            }
            if (this.match(TokenType.DOT)) {
                let field = this.consume(TokenType.IDENTIFIER)
                result = new  FieldAccessExpression(result, field)
            }
            if (this.match(TokenType.LBRACKET)) {
                let start = this.last()
                let index = this.expression()
                let end = this.consume(TokenType.RBRACKET)
                result = new ArrayAccessExpression(result, index, new Position(start, end))
            }
            if (this.match(TokenType.INCREMENT) || this.match(TokenType.DECREMENT)) {
                result = new UnaryExpression(result, this.last())
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
            return new NumberExpression(current, this.positionOf(current))
        }
        if (this.match(TokenType.TRUE) || this.match(TokenType.FALSE)) {
            return new BooleanExpression(current, this.positionOf(current))
        }
        if (this.match(TokenType.STRING)) {
            return new StringExpression(current, this.positionOf(current))
        }
        throw new ParseError('P-1003', current, [current.type])
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
        throw new ParseError('P-1004', current, [type])
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