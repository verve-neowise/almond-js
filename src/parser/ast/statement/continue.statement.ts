import { Context } from "../../../runtime";
import { ContinueError } from "../../errors";
import { Token } from "../../lexer";
import { Statement, Visitor } from "../../node";

export default class ContinueStatement implements Statement {

    constructor(
        public token: Token
    ) { }

    execute(context: Context): void {
        throw new ContinueError(`Break statement at ${this.token.row}:${this.token.column}`)
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}