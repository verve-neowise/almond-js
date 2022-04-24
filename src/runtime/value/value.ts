import ValueType from "./types";

export default class Value {
    constructor(
        readonly value: any,
        readonly type: ValueType,
    ) {}
}