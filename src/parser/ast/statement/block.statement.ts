import { Context } from "../../../runtime";
import { Token } from "../../lexer";
import { Statement, Visitor } from "../../node";
import { Position } from "../../position";

export default class Block implements Statement {
    constructor(
        private statements: Statement[] = [],
        public readonly position: Position,
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