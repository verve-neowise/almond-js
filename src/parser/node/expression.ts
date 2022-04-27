
import { Context, Value } from "../../runtime";
import { Token } from "../lexer";
import ASTNode from "./node";

export default interface Expression extends ASTNode {
    execute(context: Context): Value;
}