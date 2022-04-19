import Context from "../../runtime/Context";
import Value from "../../runtime/value/Value";
import Node from "./Node";

export default interface Expression extends Node {
    execute(context: Context): Value;
}