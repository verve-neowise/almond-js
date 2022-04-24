import { Context, Value, Types } from "../../../runtime"
import { Token } from "../../lexer"
import { Visitor, Expression, Accessible } from "../../node"

export default class VariableExpression extends Accessible implements Expression {

    constructor(private name: Token) {
        super()
    }

    public execute(context: Context): Value {
        return this.get(context)
    }

    public get(context: Context): Value {
        let value = context.get(this.name.text)
        if (value === undefined) {
            throw new Error(`Variable ${this.name.text} is not defined`)
        }
        return value
    }
    
    public set(context: Context, value: Value): void {
        if (!context.isExists(this.name.text)) {
            throw new Error(`Variable ${this.name.text} is not defined`)
        }
        context.set(this.name.text, value)
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}