import { Context, Types, Value, Arithmetics } from "../../../runtime"
import { Expression, Visitor } from "../../node"
import { TokenType } from "../../lexer";

const { divide, minus, modulo, multiply, plus, power }  = Arithmetics;

export default class BinaryExpression implements Expression {

    constructor(
        private left: Expression,
        private right: Expression,
        private operator: TokenType
    ) { }

    execute(context: Context): Value {
        let leftValue = this.left.execute(context);
        let rightValue = this.right.execute(context);

        switch(this.operator) {
            case TokenType.PLUS:
                return plus(leftValue, rightValue);
            case TokenType.MINUS:
                return minus(leftValue, rightValue);
            case TokenType.MUL:
                return multiply(leftValue, rightValue);
            case TokenType.DIV:
                return divide(leftValue, rightValue);
            case TokenType.MOD:
                return modulo(leftValue, rightValue);
            case TokenType.XOR:
                return power(leftValue, rightValue);
            default:
                throw new Error(`Unknown operator ${this.operator}`);
        }
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}