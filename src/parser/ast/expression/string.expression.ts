import { Context, Value, Types } from "../../../runtime"
import { Token } from "../../lexer"
import { Visitor, Expression } from "../../node"


export default class StringExpression implements Expression {

    constructor(private value: Token) {}

    public execute(context: Context): Value {
        return new Value(this.value.text, Types.String);
    }

    public visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}