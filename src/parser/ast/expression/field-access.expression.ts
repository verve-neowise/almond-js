import { Context, Value, Types } from "../../../runtime"
import { RuntimeError } from "../../errors"
import { Token } from "../../lexer"
import { Visitor, Expression } from "../../node"

export default class FieldAccessExpression implements Expression {
    constructor(
        private target: Expression,
        private field: Token,
    ) { }

    get token(): Token {
        return this.field
    }

    execute(context: Context): Value {
        let object = this.target.execute(context)
        if (object.type === Types.Object) {
            let field = this.field.text
            let value = object.value[field]
            return value
        }
        else {
            throw new RuntimeError('R-3006', this.token, [this.field.text, object.type])
        }
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}