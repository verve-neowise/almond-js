import Context from "../../../runtime/Context";
import Visitor from "../../../visitors/Visitor";
import Expression from "../Expression";
import Statement from "../Statement";

export default class ExprStatement implements Statement {
    
    constructor(private expr: Expression) { }

    execute(context: Context): void {
        this.expr.execute(context);
    }
    
    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}