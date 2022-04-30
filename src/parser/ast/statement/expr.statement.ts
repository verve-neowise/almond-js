import { Context, Value } from "../../../runtime"
import { Token } from "../../lexer";
import { Visitor, Expression, Statement } from "../../node"
import { Position } from "../../position";

export default class ExprStatement implements Statement {
    
    constructor(private expr: Expression) { }

    get position(): Position {
        return this.expr.position;
    }

    get start(): Token {
        return this.expr.start
    }

    get end(): Token {
        return this.expr.end
    }

    execute(context: Context): Value {
        return this.expr.execute(context);
    }
    
    visit(visitor: Visitor): void {
        visitor.visit(this);
    }
}