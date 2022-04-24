import { Types, Value } from ".";

export class Variable {
    constructor(
        public value: Value,
        public type: Types,
        public isConst: boolean,
    ) { }
}