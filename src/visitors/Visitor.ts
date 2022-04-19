import Node from "../parser/ast/Node";

export default interface Visitor {
    visit(node: Node): void;
    visit(list: NodeList): void;
}