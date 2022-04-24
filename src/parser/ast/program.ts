import { Context, Value } from "../../runtime";
import { ReturnError } from "../errors";
import { Statement } from "../node";

export default class Program {

    constructor(private _statements: Statement[]) {}

    execute(context: Context): Value | undefined {
        try {
            this._statements.forEach(statement => statement.execute(context));
        }
        catch(e) {
            if (e instanceof ReturnError) {
                return context.result
            }
            else {
                throw e
            }
        }
    }
}