import { Context, Types, Value } from "../../../runtime"
import { Expression, Visitor } from "../../node"
import { Token, TokenType } from "../../lexer";
import { RuntimeError } from "../../errors";
import { Position } from "../../position";

export default class ConditionalExpression implements Expression {
    constructor(
        public left: Expression,
        public right: Expression,
        public operator: Token,
        public position: Position = new Position(operator, operator)
    ) {}


    get start(): Token {
        return this.left.start
    }

    get end(): Token {
        return this.right.end
    }


    execute(context: Context): Value {
        let leftValue = this.left.execute(context).value;
        let rightValue = this.right.execute(context).value;

        switch (this.operator.type) {
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
                throw new RuntimeError('R-3005', this.position, [this.operator.type]);
        }
    }

    visit(visitor: Visitor): void {
        throw new Error("Method not implemented.");
    }
}