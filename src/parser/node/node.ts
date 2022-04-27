import { Token } from '../lexer';
import {  Visitor } from './'

interface ASTNode {
    visit(visitor: Visitor): void;
    get token(): Token;
}

export default ASTNode;