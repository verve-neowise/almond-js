import { ArrayValue, Context, Types, Value } from "../../../runtime"
import { RuntimeError } from "../../errors"
import { Token } from "../../lexer"
import { Accessible, Expression, Visitor } from "../../node"
import { Position } from "../../position"

export default class ArrayAccessExpression extends Accessible implements Expression {
    constructor(
        private target: Expression,
        private index: Expression,
        public readonly position: Position
    ) {
        super()
     }

    get start(): Token {
        return this.position.start
    }

    get end(): Token {
        return this.position.end        
    }

    execute(context: Context): Value {
        return this.get(context)
    }

    get(context: Context): Value {
        let array = this.target.execute(context)
        if (array.type === Types.Array && array instanceof ArrayValue) {
            let index = this.index.execute(context).value
            return array.get(index)
        }
        else {
            throw new RuntimeError('R-3001', this.position, [array.type])
        }
    }
    
    set(context: Context, value: Value): void {
        let array = this.target.execute(context)
        if (array.type === Types.Array && array instanceof ArrayValue) {
            let index = this.index.execute(context).value
            array.set(index, value)
        }
        else {
            throw new RuntimeError('R-3001', this.position, [array.type])
        }
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}