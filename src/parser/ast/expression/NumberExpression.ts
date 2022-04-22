import Context from "../../../runtime/Context";
import NumberValue from "../../../runtime/value/NumberValue";
import Value from "../../../runtime/value/Value";
import Visitor from "../../../visitors/Visitor";
import Token from "../../lexer/token";
import Expression from "../Expression";

export default class NumberExpression implements Expression {
    
    constructor(private value: Token) {}

    public execute(context: Context): Value {
        return new NumberValue(Number(this.value.text));
    }

    public visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}