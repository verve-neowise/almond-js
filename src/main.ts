import { Lexer, Source } from "./parser/lexer";
import Parser from "./parser/parser";
import fs from 'fs'
import { SimpleContext, extensions } from "./lib";
import { Context } from "./runtime";


function parse(code: string) {

    let lexer = new Lexer(new Source(code));
    let tokens = lexer.tokenize();

    return new Parser(tokens).parse();
}

function context(): Context {
    let context = new SimpleContext();
    context.apply(extensions.stdlib)

    return context
}

function runFile(path: string) {
    console.log('execute', path);

    const code = fs.readFileSync('code/' + path, 'utf8');
    let program = parse(code)
    
    let result = program.execute(context())
    console.log('result:', result?.value);
}

// runFile('test.cdx')
// runFile('let.cdx')
// runFile('if.cdx')
// runFile('for.cdx') // Not working
// runFile('repeat.cdx')
let file = process.argv[2] || 'for.cdx'
runFile(file)