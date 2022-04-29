import { Token } from '../lexer';
import { Position } from '../position';
import {  Visitor } from './'

interface ASTNode {
    visit(visitor: Visitor): void;
    get position(): Position;
}

export default ASTNode;