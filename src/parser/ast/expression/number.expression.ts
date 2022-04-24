import { Context, Value, Types } from "../../../runtime"
import { Token } from "../../lexer"
import { Visitor, Expression } from "../../node"

export default class NumberExpression implements Expression {
    
    constructor(private value: Token) {}

    public execute(context: Context): Value {
        return new Value(Number(this.value.text), Types.Number);
    }

    public visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}