import Token from "./lexer/token";
import Node from "./ast/Node";
import TokenType from "./lexer/token.type";
import NumberExpression from "./ast/expression/NumberExpression";
import StringExpression from "./ast/expression/StringExpression";

export default class Parser {

    private pos = 0
    private readonly size: number


    constructor(private tokens: Token[]) {
        this.size = tokens.length
    }

    parse() : Node {
        
    }

    private value(): Node {
        let current = this.current()
        if (this.match(TokenType.NUMBER)) {
            return new NumberExpression(current)
        }
        if (this.match(TokenType.TRUE) || this.match(TokenType.FALSE)) {
            return new NumberExpression(current)
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