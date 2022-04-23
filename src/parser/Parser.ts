import Token from "./lexer/token";
import Node from "./ast/Node";
import TokenType from "./lexer/token.type";
import NumberExpression from "./ast/expression/NumberExpression";
import StringExpression from "./ast/expression/StringExpression";
import BooleanExpression from "./ast/expression/BooleanExpression";
import TernaryExpression from "./ast/expression/TernaryExpression";
import Expression from "./ast/Expression";
import BinaryExpression from "./ast/expression/BinaryExpression";

export default class Parser {

    private pos = 0
    private readonly size: number


    constructor(private tokens: Token[]) {
        this.size = tokens.length
    }

    // parse() : Node {
        
    // }

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
            return new BinaryExpression(result, this.conditional(), TokenType.EQ)
        }
        else if (this.match(TokenType.NEQ)) {
            return new BinaryExpression(result, this.conditional(), TokenType.NEQ)
        }
        else return result
    }

    private conditional(): Expression {
        let result = this.additive()
    }

    private additive(): Expression {
    }

    private multiplicative(): Expression {
    }

    private unary(): Expression {
    }

    private primary(): Expression {

    }

    private expressionInParen(): Expression {

    }

    private array(): Expression {

    }

    private variableSuffix(): Expression {

    }

    private value(): Expression {
        let current = this.current()
        if (this.match(TokenType.NUMBER)) {
            return new NumberExpression(current)
        }
        if (this.match(TokenType.TRUE) || this.match(TokenType.FALSE)) {
            return new BooleanExpression(Boolean(current.text))
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