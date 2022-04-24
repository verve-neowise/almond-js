import {  Visitor } from './'

interface ASTNode {
    visit(visitor: Visitor): void;
}

export default ASTNode;