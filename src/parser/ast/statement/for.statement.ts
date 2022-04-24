import { VarDeclarationStatement } from ".";
import { Context, Types, Value } from "../../../runtime";
import { BreakError, ContinueError } from "../../errors";
import { Token } from "../../lexer";
import { Expression, Statement, Visitor } from "../../node";
import { VariableExpression } from "../expression";

export default class ForStatement implements Statement {

    constructor(
        private variable: Token,
        private start: Expression,
        private end: Expression,
        private step: Expression | undefined,
        private block: Statement
    ) {}

    execute(context: Context): void {
        let variable = new VariableExpression(this.variable);
        new VarDeclarationStatement(this.variable, this.start, false).execute(context);

        while (true) {
            let value = variable.get(context).value;
            let end = this.end.execute(context).value;

            if (value > end) {
                break;
            }
            try {
                this.block.execute(context);
            }
            catch(e) {
                if (e instanceof BreakError) {
                    break
                }
                if (e instanceof ContinueError) {
                    continue
                }
            }
            let step = this.step?.execute(context).value ?? 1;
            if (this.step) {
                step = this.step.execute(context).value;
            }
            variable.set(context, new Value(value + step, Types.Number));
        }
    }
    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}
