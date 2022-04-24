import ValueType from "./types";

export default class Value {
    constructor(
        private readonly _value: any,
        readonly type: ValueType,
    ) {}

    get value() {
        return this._value;
    }
}