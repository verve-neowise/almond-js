import { ReturnError } from "../parser/errors";
import { Context, Executable, FunctionValue, Types, Value } from "../runtime";
import { Variable } from "../runtime/variable";

export default class SimpleContext implements Context {


    public result: Value | undefined;
    private variables = new Map<string, Variable>()

    return(value: Value) {
        this.result = value
        throw new ReturnError('return')
    }

    declare(name: string, value: Value, type: Types, isConst: boolean): void {
        this.variables.set(name, new Variable(value, type, isConst))
    }

    typeOf(name: string): Types {
        return this.variables.get(name)!.type
    }

    isConst(text: string): boolean {
        return this.variables.get(text)!.isConst
    }

    isExists(name: string): boolean {
        return this.variables.has(name)
    }

    set(name: string, value: Value): void {
        this.variables.get(name)!.value = value
    }

    get(name: string): Value {
        return this.variables.get(name)!.value
    }

    function(name: string, executable: Executable): void {
        this.variables.set(name, new Variable(new FunctionValue(executable), Types.Function, true))
    }

    apply(extension: (context: Context) => void): void {
        extension(this)
    }
}