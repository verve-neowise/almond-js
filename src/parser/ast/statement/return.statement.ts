import { Context, Value } from "../../../runtime"
import { Visitor, Expression, Statement } from "../../node"
import { Position } from "../../position";

export default class ReturnStatement implements Statement {
    
    constructor(private expr: Expression, public readonly position: Position) { }

    execute(context: Context): void {
        let value = this.expr.execute(context);
        context.return(value)
    }
    
    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}