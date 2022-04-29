import { Context, typeOf } from "../../../runtime";
import { Token } from "../../lexer";
import { Expression, Statement, Visitor } from "../../node";
import { Position } from "../../position";

export default class VarDeclarationStatement implements Statement {

    constructor(
        public variable: Token,
        private type: Token,
        private value: Expression,
        private isConst: boolean,
        public readonly position: Position
    ) {}

    execute(context: Context): void {
        let name = this.variable.text;
        if (context.isExists(name)) {
            throw new Error(`Variable ${name} is already defined`);
        }
        let value = this.value.execute(context);
        let type = typeOf(this.type.text);

        if (value.type !== type) { 
            throw new Error(`Type of variable ${name} is ${value.type}, but ${type} is expected`);
        }
        
        context.declare(name, value, type, this.isConst);
    }

    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}