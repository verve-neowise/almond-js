import { Context, Types, Value } from "../../../runtime";
import { RuntimeError } from "../../errors";
import { Token } from "../../lexer";
import { Expression, Visitor } from "../../node";

export default class ConditionExpression implements Expression {
    constructor(
        private expression: Expression,
    ) {}

    execute(context: Context): Value {
        let value = this.expression.execute(context);
        if (value.type === Types.Boolean) {
            return value;
        }
        else {
            throw new RuntimeError('R-3004', this.expression.token, [value.type]);
        }
    }

    get token(): Token {
        return this.expression.token;
    }
    
    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}