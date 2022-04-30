import { Context, Value } from "../../../runtime"
import { Token } from "../../lexer";
import { Visitor, Expression, Statement } from "../../node"
import { Position } from "../../position";

export default class ReturnStatement implements Statement {
    
    constructor(private expr: Expression, public readonly position: Position) { }

    get start(): Token {
        return this.position.start
    }

    get end(): Token {
        return this.expr.end
    }

    execute(context: Context): void {
        let value = this.expr.execute(context);
        context.return(value)
    }
    
    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}