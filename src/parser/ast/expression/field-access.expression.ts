import { Context, Value, Types } from "../../../runtime"
import { RuntimeError } from "../../errors"
import { Token } from "../../lexer"
import { Visitor, Expression } from "../../node"
import { Position } from "../../position"

export default class FieldAccessExpression implements Expression {
    constructor(
        private target: Expression,
        private field: Token,
        public readonly position: Position = new Position(field, field),
    ) { }

    get start(): Token {
        return this.position.start
    }

    get end(): Token {
        return this.position.end
    }

    execute(context: Context): Value {
        let object = this.target.execute(context)
        if (object.type === Types.Object) {
            let field = this.field.text
            let value = object.value[field]
            return value
        }
        else {
            throw new RuntimeError('R-3006', this.position, [this.field.text, object.type])
        }
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}