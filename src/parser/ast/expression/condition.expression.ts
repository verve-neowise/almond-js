import { Context, Types, Value } from "../../../runtime";
import { RuntimeError } from "../../errors";
import { Token } from "../../lexer";
import { Expression, Visitor } from "../../node";
import { Position } from "../../position";

export default class ConditionExpression implements Expression {
    constructor(
        private expression: Expression
    ) {}

    get start(): Token {
        return this.expression.start
    }

    get end(): Token {
        return this.expression.end
    }

    execute(context: Context): Value {
        let value = this.expression.execute(context);
        if (value.type === Types.Boolean) {
            return value;
        }
        else {
            throw new RuntimeError('R-3004', this.expression.position, [value.type]);
        }
    }

    get position(): Position {
        return this.expression.position;
    }
    
    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}