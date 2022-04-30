import { Token } from '../lexer';
import { Position } from '../position';
import {  Visitor } from './'

interface ASTNode {
    visit(visitor: Visitor): void;
    
    get position(): Position;

    get start(): Token
    get end(): Token
}

export default ASTNode;