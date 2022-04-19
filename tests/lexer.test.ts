import { Source } from '../src/parser/source/source'
import Token from '../src/parser/lexer/token'
import TokenType from '../src/parser/lexer/token.type'
import Lexer from '../src/parser/lexer/lexer'
import { expect } from 'chai'

describe('Lexer simple parse', () => {

    it('Checking simple math operations', () => {
        const source = new Source('1 + 2 * 3')
        const lexer = new Lexer(source)
        const tokens = lexer.tokenize()
        expect(tokens).equal([
            new Token('1', TokenType.NUMBER),
            new Token('', TokenType.PLUS),
            new Token('2', TokenType.NUMBER),
            new Token('', TokenType.MUL),
            new Token('3', TokenType.NUMBER)
        ])
    })
})