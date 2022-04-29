import { Context } from "../../../runtime";
import { Token } from "../../lexer";
import { Statement, Visitor } from "../../node";
import { Position } from "../../position";

export default class NamedBlock implements Statement {
    constructor(
        private statements: Statement,
        public readonly token: Token,
        public readonly position: Position = new Position(token, token),
    ) { }

    execute(context: Context): void {
        this.statements.execute(context)
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}