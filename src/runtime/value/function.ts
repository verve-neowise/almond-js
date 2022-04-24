import { Executable, Types, Value } from "..";

export default class FunctionValue extends Value {

    constructor(executable: Executable) {
        super(executable, Types.Function);
    }
}