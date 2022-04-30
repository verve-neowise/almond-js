import { Context } from "../../../runtime";
import { Token } from "../../lexer";
import { Expression, Statement, Visitor } from "../../node";
import { Position } from "../../position";

export default class ErrorStatement implements Statement {

    constructor(
        private message: Expression,
        public readonly position: Position
    ) { }

    get start(): Token {
        return this.position.start
    }

    get end(): Token {
        return this.message.end
    }

    execute(context: Context): void {
        throw new Error(this.message.execute(context).toString());
    }

    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}