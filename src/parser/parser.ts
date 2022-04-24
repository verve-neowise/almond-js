import ExprStatement from "./ast/statement/expr.statement";
import { TokenType, Token } from "./lexer";
import { Statement, Expression } from "./node";
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
    BooleanExpression
  } from './ast/expression'


export default class Parser {

    private pos = 0
    private readonly size: number

    constructor(private tokens: Token[]) {
        this.size = tokens.length
    }

    parse() : Statement {
        return new ExprStatement(this.expression())
    }

    private expression(): Expression {
        return this.ternary()
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
                result = new BinaryExpression(result, this.additive(), TokenType.LT)
                continue
            }
            if (this.match(TokenType.GT)) {
                result = new BinaryExpression(result, this.additive(), TokenType.GT)
                continue
            }
            if (this.match(TokenType.LEQ)) {
                result = new BinaryExpression(result, this.additive(), TokenType.LEQ)
                continue
            }
            if (this.match(TokenType.GEQ)) {
                result = new BinaryExpression(result, this.additive(), TokenType.GEQ)
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
            return this.variableSuffix(this.expressionInParen())
        }
        if (this.match(TokenType.LBRACKET)) {
            return this.variableSuffix(this.array())
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
                    return new InvokeExpression(result, this.functionArgs())
                }
                if (this.match(TokenType.DOT) && result instanceof VariableExpression) {
                    // UnknownWordsExpression(mutableListOf(consume(WORD)))
                }
                if (this.match(TokenType.DOT)) {
                    return new FieldAccessExpression(result, this.consume(TokenType.IDENTIFIER))
                }
                if (this.match(TokenType.LBRACKET)) {
                    let index = this.expression()
                    this.consume(TokenType.RBRACKET)
                    return new ArrayAccessExpression(result, index)
                }
                if (this.match(TokenType.INCREMENT)) {
                    return new UnaryExpression(result, TokenType.INCREMENT)
                }
                if (this.match(TokenType.DECREMENT)) {
                    return new UnaryExpression(result, TokenType.DECREMENT)
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
            return new VariableExpression(current)
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

    private get(relativePos: number): Token {
        let position = this.pos + relativePos
        if (position < 0 || position >= this.size) {
            throw new Error(`Out of bounds: ${position}`)
        }
        return this.tokens[position]
    }
}