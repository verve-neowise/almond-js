import { Context, Value, Types, Unary } from "../../../runtime"
import { Token, TokenType } from "../../lexer"
import { Visitor, Expression } from "../../node"
import { Position } from "../../position";

const { positive, negative, not } = Unary

export default class UnaryExpression implements Expression {
    
    constructor(
        private right: Expression, 
        public operator: Token,
        ) { }

    get position(): Position {
        return new Position(this.operator, this.operator)
    }

    execute(context: Context): Value {
        let rightValue = this.right.execute(context).value;
        switch (this.operator.type) {
            case TokenType.PLUS:
                return positive(rightValue);
            case TokenType.MINUS:
                return negative(rightValue);
            case TokenType.NOT:
                return not(rightValue);
            default:
                throw new Error(`Unknown operator ${this.operator}`);
        }
    }
    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}