import Context from "../../runtime/Context";
import Node from "./Node";

export default interface Statement extends Node {
    execute(context: Context): void;
}