import { Context, Value, Types } from "../../../runtime"
import { Token } from "../../lexer"
import { Visitor, Expression } from "../../node"
import { Position } from "../../position";


export default class StringExpression implements Expression {

    constructor(
        private value: Token,
        public readonly position: Position
        ) {}

    public execute(context: Context): Value {
        return new Value(this.value.text, Types.String);
    }

    public visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}