import Context from "../../../runtime/Context";
import NumberValue from "../../../runtime/value/NumberValue";
import Value from "../../../runtime/value/Value";
import Visitor from "../../../visitors/Visitor";
import Expression from "../Expression";

export default class NumberExpression implements Expression {
    
    constructor(private value: number) {}

    public execute(context: Context): Value {
        return new NumberValue(this.value);
    }

    public visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}