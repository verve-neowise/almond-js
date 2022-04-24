import { Context } from "../../../runtime";
import { Token } from "../../lexer";
import { Expression, Statement, Visitor } from "../../node";

export default class VarDeclarationStatement implements Statement {

    constructor(private variable: Token, private value: Expression, private isConst: boolean) {}

    execute(context: Context): void {
        let name = this.variable.text;
        if (context.isExists(name)) {
            throw new Error(`Variable ${name} is already defined`);
        }
        let value = this.value.execute(context);
        context.declare(name, value, this.isConst);
    }

    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}