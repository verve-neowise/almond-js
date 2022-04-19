import Context from "../../runtime/Context";
import Visitor from "../../visitors/Visitor";
import Node from "./Node";

export class NodeList implements Node {

    constructor(private nodes: Node[]) {}
    
    execute(context: Context): Node {
        return this;
    }

    public visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}