import Lexer from "../src/parser/lexer/lexer";
import Parser from "../src/parser/Parser";
import { Source } from "../src/parser/source/source";
import Context from "../src/runtime/Context";
import TestContext from "./context";

export default (expr: string, options: { ast?: boolean, tokens?: boolean }) => {
    const source = new Source(expr);
    const lexer = new Lexer(source);
    const tokens = lexer.tokenize();

    if (options.tokens) {
        console.table(tokens);
    }

    const ast = new Parser(tokens).parse();
    
    if (options.ast) {
        console.dirxml(ast);
    }

    return ast
}