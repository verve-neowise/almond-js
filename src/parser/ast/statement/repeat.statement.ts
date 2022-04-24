import { Context } from "../../../runtime";
import { BreakError } from "../../errors";
import { Expression, Statement, Visitor } from "../../node";

export default class RepeatStatement implements Statement {
    
    constructor(private count: Expression | undefined, private  block: Statement) {}
    
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