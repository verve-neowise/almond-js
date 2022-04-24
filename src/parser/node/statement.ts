import { Context } from "../../runtime";
import { ASTNode as ASTNode } from ".";

export default interface Statement extends ASTNode {
    execute(context: Context): void;
}