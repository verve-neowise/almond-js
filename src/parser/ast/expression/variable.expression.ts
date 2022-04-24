import { Context, Value, Types } from "../../../runtime"
import { Token } from "../../lexer"
import { Visitor, Expression } from "../../node"

export default class VariableExpression implements Expression {

    constructor(private name: Token) {}

    public execute(context: Context): Value {
        let value = context.getVariable(this.name.text)
        if (value === undefined) {
            throw new Error(`Variable ${this.name.text} is not defined`)
        }
        return value
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}