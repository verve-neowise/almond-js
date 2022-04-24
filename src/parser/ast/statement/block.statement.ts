import { Context } from "../../../runtime";
import { Statement, Visitor } from "../../node";

export default class Block implements Statement {
    constructor(
        private statements: Statement[] = []
    ) {}

    execute(context: Context): void {
        for (let statement of this.statements) {
            statement.execute(context)
        }
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}