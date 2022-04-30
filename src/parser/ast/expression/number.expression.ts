import { Context, Value, Types } from "../../../runtime"
import { Token } from "../../lexer"
import { Visitor, Expression } from "../../node"
import { Position } from "../../position";

export default class NumberExpression implements Expression {
    
    constructor(
        private value: Token,
        public readonly position: Position
    ) {}
    
    get start(): Token {
        return this.value
    }

    get end(): Token {
        return this.value
    }

    public execute(context: Context): Value {
        return new Value(Number(this.value.text), Types.Number);
    }

    public visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}