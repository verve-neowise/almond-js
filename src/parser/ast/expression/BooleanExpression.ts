import Context from "../../../runtime/Context";
import BooleanValue from "../../../runtime/value/BooleanValue";
import Value from "../../../runtime/value/Value";
import Visitor from "../../../visitors/Visitor";
import Expression from "../Expression";

export default class BooleanExpression implements Expression {

    constructor(public value: boolean) {}
    
    visit(visitor: Visitor): void {
        visitor.visit(this);
    }

    public execute(context: Context): Value {
        return new BooleanValue(this.value);
    }

}