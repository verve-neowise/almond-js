import { Context, Types, Value } from "../../../runtime"
import { Expression, Visitor } from "../../node"
import { TokenType } from "../../lexer";

export default class ConditionalExpression implements Expression {
    constructor(
        public left: Expression,
        public right: Expression,
        public operator: TokenType
    ) {}

    execute(context: Context): Value {
        let leftValue = this.left.execute(context).value;
        let rightValue = this.right.execute(context).value;

        switch (this.operator) {
            case TokenType.LT:
                return new Value(leftValue < rightValue, Types.Boolean);
            case TokenType.LEQ:
                return new Value(leftValue <= rightValue, Types.Boolean);
            case TokenType.GT:
                return new Value(leftValue > rightValue, Types.Boolean);
            case TokenType.GEQ:
                return new Value(leftValue >= rightValue, Types.Boolean);
            case TokenType.EQ:
                return new Value(leftValue === rightValue, Types.Boolean);
            case TokenType.NEQ:
                return new Value(leftValue !== rightValue, Types.Boolean);
            default:
                throw new Error(`Unknown operator ${this.operator}`);
        }
    }

    visit(visitor: Visitor): void {
        throw new Error("Method not implemented.");
    }
}