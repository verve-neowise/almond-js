import { Context, Value } from "../../../runtime"
import { Visitor, Expression, Statement } from "../../node"

export default class ReturnStatement implements Statement {
    
    constructor(private expr: Expression) { }

    execute(context: Context): void {
        let value = this.expr.execute(context);
        context.return(value)
    }
    
    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}