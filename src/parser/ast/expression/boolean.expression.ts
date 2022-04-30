import { Context, Types, Value } from "../../../runtime"
import { Expression, Visitor } from "../../node"
import { Token } from "../../lexer";
import { Position } from "../../position";

export default class BooleanExpression implements Expression {

    constructor(
        public value: Token,
        public readonly position: Position
    ) {}

    
    get start(): Token {
        return this.position.start
    }

    get end(): Token {
        return this.position.end
    }

    
    get token(): Token {
        return this.value;
    }

    visit(visitor: Visitor): void {
        visitor.visit(this);
    }

    public execute(context: Context): Value {
        return new Value(Boolean(this.value.text), Types.Boolean);
    }
}