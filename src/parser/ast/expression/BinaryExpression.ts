import Context from "../../../runtime/Context";
import NumberValue from "../../../runtime/value/NumberValue";
import StringValue from "../../../runtime/value/StringValue";
import Value from "../../../runtime/value/Value";
import ValueType from "../../../runtime/value/ValueType";
import Visitor from "../../../visitors/Visitor";
import TokenType from "../../lexer/token.type";
import Expression from "../Expression";

export default class BinaryExpression implements Expression {

    constructor(
        private left: Expression,
        private right: Expression,
        private operator: TokenType
    )  {}

    execute(context: Context): Value {
        let left = this.left.execute(context);
        let right = this.right.execute(context);

        if (left.type() === ValueType.Number && right.type() === ValueType.Number) {
            let leftValue = left.asNumber();
            let rightValue = right.asNumber();

            switch (this.operator) {
                case TokenType.PLUS:
                    return new NumberValue(leftValue + rightValue);
                case TokenType.MINUS:
                    return new NumberValue(leftValue - rightValue);
                case TokenType.MUL:
                    return new NumberValue(leftValue * rightValue);
                case TokenType.DIV:
                    return new NumberValue(leftValue / rightValue);
                case TokenType.MOD:
                    return new NumberValue(leftValue % rightValue);
                // case TokenType.POW:
                //     return new NumberValue(Math.pow(leftValue, rightValue));
                default:
                    throw new Error(`Unknown operator ${this.operator}`);
            }
        }
        else if (left.type() === ValueType.String) {
            let leftValue = left.asString();
            let rightValue = right.asString();

            switch (this.operator) {
                case TokenType.PLUS:
                    return new StringValue(leftValue + rightValue);
                default:
                    throw new Error(`Unknown operator ${this.operator}`);
            }
        }
        else {
            throw new Error(`Cannot apply operator ${this.operator} to ${left.type()} and ${right.type()}`);
        }
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}