import Lexer from "./parser/lexer/lexer"
import { Source } from "./parser/source/source"

const source = new Source('1+2*3 - function(a, b) { return a + b }')
const lexer = new Lexer(source)
const tokens = lexer.tokenize()

console.log(tokens);
