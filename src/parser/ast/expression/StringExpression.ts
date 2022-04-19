import Context from "../../../runtime/Context";
import StringValue from "../../../runtime/value/StringValue";
import Value from "../../../runtime/value/Value";
import Visitor from "../../../visitors/Visitor";
import Expression from "../Expression";

export default class StringExpression implements Expression {

    constructor(private value: string) {}

    public execute(context: Context): Value {
        return new StringValue(this.value);
    }

    public visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}