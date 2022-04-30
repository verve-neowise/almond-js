import { Context } from "../../../runtime";
import { Token } from "../../lexer";
import { Expression, Statement, Visitor } from "../../node";
import { Position } from "../../position";
import { ConditionExpression } from "../expression";

export default class IfEseStatement implements Statement {
    
    constructor(
        private condition: ConditionExpression,
        private block: Statement,
        private elseBlock: Statement | undefined,
        public readonly position: Position
    ) {}
    
    get start(): Token {
        return this.position.start
    }

    get end(): Token {
        return this.position.end
    }

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