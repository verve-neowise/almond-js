import { Context, Value } from "../../../runtime"
import { Visitor, Expression, Statement } from "../../node"

export default class ExprStatement implements Statement {
    
    constructor(private expr: Expression) { }

    execute(context: Context): Value {
        return this.expr.execute(context);
    }
    
    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}