import { ArrayValue, Context, Types, Value } from "../../../runtime"
import { Token } from "../../lexer"
import { Expression, Visitor } from "../../node"
import { Position } from "../../position"

export default class ArrayExpression implements Expression {
    
    constructor(
        private elements: Expression[],
        public readonly position: Position
    ) { }
    
    get start(): Token {
        return this.position.start
    }

    get end(): Token {
        return this.position.end        
    }


    execute(context: Context): Value {
        return new ArrayValue(this.elements.map(element => element.execute(context)))
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}