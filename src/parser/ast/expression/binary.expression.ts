import { Context, Types, Value, Arithmetics } from "../../../runtime"
import { Expression, Visitor } from "../../node"
import { Token, TokenType } from "../../lexer";
import { RuntimeError } from "../../errors";

const { divide, minus, modulo, multiply, plus, power }  = Arithmetics;

export default class BinaryExpression implements Expression {

    constructor(
        private left: Expression,
        private right: Expression,
        private operator: Token
    ) { }
    
    get token(): Token {
        return this.operator;
    }

    execute(context: Context): Value {
        let leftValue = this.left.execute(context);
        let rightValue = this.right.execute(context);

        switch(this.operator.type) {
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
                throw new RuntimeError('R-3003', this.operator, [this.operator.type]);
        }
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}