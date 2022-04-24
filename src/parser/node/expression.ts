
import { Context, Value } from "../../runtime";
import ASTNode from "./node";

export default interface Expression extends ASTNode {
    execute(context: Context): Value;
}