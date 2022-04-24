import { Context } from "../../../runtime";
import { Expression, Statement, Visitor } from "../../node";

export default class ErrorStatement implements Statement {

    constructor(private message: Expression) { }

    execute(context: Context): void {
        throw new Error(this.message.execute(context).toString());
    }

    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}