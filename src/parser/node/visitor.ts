import ASTNode from "./node";

export default interface Visitor {
    visit(node: ASTNode): void;
    visit(list: NodeList): void;
}