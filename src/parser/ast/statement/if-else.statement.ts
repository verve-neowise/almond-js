import { Context } from "../../../runtime";
import { Expression, Statement, Visitor } from "../../node";
import { ConditionExpression } from "../expression";

export default class IfEseStatement implements Statement {
    
    constructor(
        private condition: ConditionExpression,
        private block: Statement,
        private elseBlock?: Statement | undefined
    ) {}
    
    execute(context: Context): void {
        if (this.condition.execute(context).value) {
            this.block.execute(context);
        } else if (this.elseBlock) {
            this.elseBlock.execute(context);
        }
    }

    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}