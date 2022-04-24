import { Context, Value, Types } from "../../../runtime"
import { Token } from "../../lexer"
import { Visitor, Expression } from "../../node"

export default class FieldAccessExpression implements Expression {
    constructor(
        private target: Expression,
        private field: Token,
    ) { }

    execute(context: Context): Value {
        let object = this.target.execute(context)
        if (object.type === Types.Object) {
            let field = this.field.text
            let value = object.value[field]
            return value
        }
        else {
            throw new Error(`Cannot access field ${this.field.text} of ${object.type}`)
        }
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}