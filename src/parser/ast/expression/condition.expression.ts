import { Context, Types, Value } from "../../../runtime";
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
            throw new Error(`Condition expression must be boolean, but got ${value.type}`);
        }
    }
    
    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}