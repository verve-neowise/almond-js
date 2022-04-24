import { Context, Types, Value } from "../../../runtime"
import { Expression, Visitor } from "../../node"

export default class ArrayExpression implements Expression {
    
    constructor(private elements: Expression[]) { }
    
    execute(context: Context): Value {
        return new Value(this.elements.map(element => element.execute(context)), Types.Array)
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}