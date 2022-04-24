import { ArrayValue, Context, Types, Value } from "../../../runtime"
import { Expression, Visitor } from "../../node"

export default class ArrayAccessExpression implements Expression {
    constructor(
        private target: Expression,
        private index: Expression,
    ) { }

    execute(context: Context): Value {
        let array = this.target.execute(context)
        if (array.type === Types.Array && array instanceof ArrayValue) {
            let index = this.index.execute(context).value
            return array.get(index)
        }
        else {
            throw new Error(`Cannot apply array access to ${array.type}`)
        }
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}