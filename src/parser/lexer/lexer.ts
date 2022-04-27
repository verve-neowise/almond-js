import { LexerError, ParseError } from "../errors"
import { Source } from "./source/source"
import Token from "./token"
import TokenType from "./token.type"

const operatorChars = '+-*/%()[]{}=<>!&|.,^~?:;'
const whitespaceChars = '\n \t\b\r'
const specialChars = '\\\'nrtbfv'

const operators = [
    TokenType.AND, TokenType.OR, TokenType.EQ, TokenType.NEQ,
    TokenType.LT, TokenType.GT, TokenType.LEQ, TokenType.GEQ,
    TokenType.PLUS, TokenType.MINUS, TokenType.MUL, TokenType.DIV,
    TokenType.MOD, TokenType.NOT, TokenType.ASSIGN, TokenType.LPAREN,
    TokenType.RPAREN, TokenType.LBRACE, TokenType.RBRACE, TokenType.LBRACKET,
    TokenType.RBRACKET, TokenType.COMMA, TokenType.SEMICOLON, TokenType.COLON,
    TokenType.COLONCOLON, TokenType.FUNCTIONAL, TokenType.DOT, TokenType.QUESTION,
    TokenType.ELVIS, TokenType.AT, TokenType.ELLIPSIS, TokenType.HASH, TokenType.TILDE,
    TokenType.INCREMENT, TokenType.DECREMENT, TokenType.PLUS_EQ, TokenType.MINUS_EQ,
    TokenType.MUL_EQ, TokenType.DIV_EQ, TokenType.MOD_EQ, TokenType.AND_EQ,
    TokenType.OR_EQ, TokenType.XOR_EQ
]

const keywords = [
    TokenType.IF, TokenType.ELSE,
    TokenType.WHILE, TokenType.DO,
    TokenType.FOR, TokenType.TO, TokenType.DOWNTO, TokenType.STEP,
    TokenType.BREAK, TokenType.CONTINUE,
    TokenType.RETURN, TokenType.REPEAT,
    TokenType.LET, TokenType.CONST,
    TokenType.TRUE, TokenType.FALSE,

    TokenType.NUMBER_TYPE, TokenType.STRING_TYPE, TokenType.BOOLEAN_TYPE,
    TokenType.ARRAY_TYPE, TokenType.FUNCTION_TYPE, TokenType.NULL_TYPE,
    TokenType.OBJECT_TYPE
]

function isDigit(char: string): boolean {
    return char >= '0' && char <= '9'
}

function isIdentifierStart(char: string): boolean {
    return char >= 'a' && char <= 'z' || char >= 'A' && char <= 'Z' || char === '_'
}

function isSpecialChar(char: string): boolean {
    return specialChars.indexOf(char) >= 0
}

function isLetterOrDigit(char: string): boolean {
    return isIdentifierStart(char) || isDigit(char)
}

export default class Lexer {
    private source: Source

    private tokens: Token[] = []
    private buffer: string[] = []

    constructor(source: Source) {
        this.source = source
    }

    tokenize(): Token[] {

        while (!this.source.end()) {

            let char = this.source.peek(0)
            
            if (isDigit(char)) {
                this.tokenizeNumber()
            }
            else if (isIdentifierStart(char)) {
                this.tokenizeIdentifier()
            }
            else if (char === '\'') {
                this.tokenizeString()
            }
            // if operator
            else if (operatorChars.indexOf(char) >= 0) {
                this.tokenizeOperator()
            }
            // if whitespace
            else if (whitespaceChars.indexOf(char) >= 0 || char === ' ') {
                this.source.next()
            }
            else if (char === '\u0000') {
                break
            }
            else {
                throw new LexerError('L-2010', this.source.row, this.source.column, [char])
            }
        }
        return this.tokens
    }


    tokenizeNumber() {
        this.clearBuffer()

        let current = this.source.peek(0)

        while(true) {


            if (current === '.' && this.buffer.includes('.')) {
                throw new LexerError('L-2011', this.source.row, this.source.column)
            }
            else if (!isDigit(current)) {
                break
            }
            this.buffer.push(current)
            current = this.source.next()
        }
        this.addToken(this.buffer.join(''), TokenType.NUMBER)
    }

    tokenizeIdentifier() {
        this.clearBuffer()
        let current = this.source.peek(0)

        while(true) {
            if (!isLetterOrDigit(current)) {
                break
            }
            this.buffer.push(current)
            current = this.source.next()
        }

        let indetifier = this.buffer.join('')
        let keyword = keywords.find(keyword => keyword === indetifier)

        if (keyword) {
            this.addToken(indetifier, keyword)
        }
        else {
            this.addToken(indetifier, TokenType.IDENTIFIER)
        }
    }

    tokenizeString() {
        this.source.next()
        this.clearBuffer()
        let current = this.source.peek(0)

        while(true) {
            if (current === '\u0000') {
                throw new LexerError('L-2012', this.source.row, this.source.column)
            }
            if (current === '\\') {
                this.source.next()
                current = this.source.peek(0)

                if (isSpecialChar(current)) {
                    this.source.next()
                    this.buffer.push(current)
                }
                else {
                    throw new LexerError('L-2013', this.source.row, this.source.column, [current])
                }
                this.buffer.push('\\')
                continue
            }
            if (current === '\'') {
                break
            }
            this.buffer.push(current)
            current = this.source.next()
        }
        this.source.next()
        this.addToken(this.buffer.join(''), TokenType.STRING)
    }

    tokenizeOperator() {
        let current = this.source.peek(0)
        if (current === '/') {
            if (this.source.peek(1) === '/') {
                this.source.next()
                this.source.next()
                this.tokenizeComment()
                return
            }
        }
        this.clearBuffer()
        while(true) {
            let text = this.buffer.join('')
            let key = text + current

            if (!operators.find(operator => operator === key) && text.length > 0) {
                let operator = operators.find(operator => operator === text)
                this.addToken("", operator!!)
                return
            }
            this.buffer.push(current)
            current = this.source.next()
        }
    }

    tokenizeComment() {
        let current = this.source.peek(0)
        while ('\r\n\u0000'.indexOf(current) === -1) {
                current = this.source.next()
        }
    }

    clearBuffer() {
        this.buffer = []
    }

    addToken(text: string, type: TokenType) {
        this.tokens.push(new Token(text, type, this.source.row, this.source.column))
    }
}

