import { Context } from "../../../runtime";
import { BreakError } from "../../errors";
import { Token } from "../../lexer";
import { Statement, Visitor } from "../../node";
import { Position } from "../../position";

export default class BreakStatement implements Statement {

    constructor(
        public token: Token,
        public readonly position: Position
    ) {}

    get start(): Token {
        return this.position.start
    }

    get end(): Token {
        return this.position.end
    }

    execute(context: Context): void {
        throw new BreakError(`Break statement at ${this.token.row}:${this.token.column}`)
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}