import { Context, Types, Value } from "../../../runtime"
import { Expression, Visitor } from "../../node"
import { Token } from "../../lexer";

export default class BooleanExpression implements Expression {

    constructor(public value: Token) {}
    
    visit(visitor: Visitor): void {
        visitor.visit(this);
    }

    public execute(context: Context): Value {
        return new Value(Boolean(this.value.text), Types.Boolean);
    }
}