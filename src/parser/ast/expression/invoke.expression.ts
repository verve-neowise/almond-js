import { Context, Value, Types } from "../../../runtime"
import { Token } from "../../lexer"
import { Visitor, Expression } from "../../node"
import { Position } from "../../position"

export default class InvokeExpression implements Expression {

    constructor(
        private target: Expression,
        private args: Expression[],
        public readonly position: Position
) {}

    public execute(context: Context): Value {
        let target = this.target.execute(context)
        if (target.type == Types.Function) {
            let args = this.args.map(arg => arg.execute(context))
            return target.value(context, args)
        }
        else {
            throw new Error(`Cannot apply invoke to ${target.type}`)
        }
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}  