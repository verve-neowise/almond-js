import Context from "../../../runtime/Context";
import BooleanValue from "../../../runtime/value/BooleanValue";
import Value from "../../../runtime/value/Value";
import Visitor from "../../../visitors/Visitor";
import Expression from "../Expression";

export default class TernaryExpression implements Expression {

    constructor(
        public result: Expression,
        public trueExpr: Expression,
        public falseExpr: Expression
    ) {}

    execute(context: Context): Value {
        let result = this.result.execute(context)
        if (result instanceof BooleanValue) {
            if (result.value) {
                return this.trueExpr.execute(context)
            } else {
                return this.falseExpr.execute(context)
            }
        }
        else {
            throw Error("Ternary expression result is not boolean")
        }
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}