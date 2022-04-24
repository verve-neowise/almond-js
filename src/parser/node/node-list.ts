
import { Context } from '../../runtime';
import { ASTNode, Visitor } from './'

export default class NodeList implements ASTNode {

    constructor(private nodes: ASTNode[]) {}
    
    execute(context: Context): ASTNode {
        return this;
    }

    public visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}