import { ReturnError } from "../parser/errors";
import { Context, Executable, Value } from "../runtime";
import FunctionValue from "../runtime/value/function";

export default class SimpleContext implements Context {

    public result: Value | undefined;
    private variables = new Map<string, { value: Value, isConst: boolean }>()

    return(value: Value) {
        this.result = value
        throw new ReturnError('return')
    }

    declare(name: string, value: Value, isConst: boolean): void {
        this.variables.set(name, { value, isConst })
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
        this.variables.set(name, { value: new FunctionValue(executable), isConst: false })
    }

    apply(extension: (context: Context) => void): void {
        extension(this)
    }
}