import { Context, Types, Value, Arithmetics } from "../../../runtime"
import { Expression, Visitor } from "../../node"
import { Token, TokenType } from "../../lexer";
import { RuntimeError } from "../../errors";
import { Position } from "../../position";

const { divide, minus, modulo, multiply, plus, power }  = Arithmetics;

export default class BinaryExpression implements Expression {

    constructor(
        private left: Expression,
        private right: Expression,
        public operator: Token,
    ) { }
    
    get position(): Position {
        return new Position(this.operator, this.operator);
    }

    get start(): Token {
        return this.left.start
    }

    get end(): Token {
        return this.right.end
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
                throw new RuntimeError('R-3003', this.position, [this.operator.type]);
        }
    }

    visit(visitor: Visitor): void {
        visitor.visit(this)
    }
}