import { Context } from "../../../runtime";
import { BreakError } from "../../errors";
import { Token } from "../../lexer";
import { Expression, Statement, Visitor } from "../../node";
import { Position } from "../../position";

export default class RepeatStatement implements Statement {
    
    constructor(
        private count: Expression | undefined,
        private  block: Statement,
        public readonly position: Position
    ) {}
    
    get start(): Token {
        return this.position.start
    }

    get end(): Token {
        return this.position.end
    }

    execute(context: Context): void {
        let count = this.count ? this.count.execute(context).value : -1;

        if (count < 0) {
            while(true) {
                try {
                    this.block.execute(context);
                }
                catch(e) {
                    if (e instanceof BreakError) {
                        break
                    } 
                }
            }
        }
        else {
            while (count--) {
                try {
                    this.block.execute(context);
                }
                catch (e) {
                    if (e instanceof BreakError) {
                        break
                    }
                }
            }
        }
    }



    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}