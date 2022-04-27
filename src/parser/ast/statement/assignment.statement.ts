import { Context, Arithmetics, Value } from "../../../runtime";
import { Token, TokenType } from "../../lexer";
import { Accessible, Expression, Statement, Visitor } from "../../node";

const { plus, minus, multiply, divide, modulo, power } = Arithmetics;

export default class AssignmentStatement implements Statement {
    
    constructor(
        private target: Accessible,
        private value: Expression,
        private operator: Token
    ) {}

    execute(context: Context): void {

        const value = this.value.execute(context);
        let result: Value

        switch (this.operator.type) {
            case TokenType.ASSIGN:
                result = value;
                break;
            case TokenType.PLUS_EQ:
                result = plus(this.target.get(context), value);
                break;
            case TokenType.MINUS_EQ:
                result = minus(this.target.get(context), value);
                break;
            case TokenType.MUL_EQ:
                result = multiply(this.target.get(context), value);
                break;
            case TokenType.DIV_EQ:
                result = divide(this.target.get(context), value);
                break;
            case TokenType.MOD_EQ:
                result = modulo(this.target.get(context), value);
                break;
            case TokenType.XOR_EQ:
                result = power(this.target.get(context), value);
                break;
            default:
                throw new Error(`Unknown operator ${this.operator}`);
        }

        this.target.set(context, result);
    }

    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}