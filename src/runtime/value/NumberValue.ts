import Value from "./Value";
import ValueType from "./ValueType";

export default class NumberValue implements Value {

    constructor(private value: number) {}

    public asString(): string {
        return this.value.toString();
    }

    public asNumber(): number {
        return this.value;
    }

    public type(): ValueType {
        return ValueType.Number;
    }
}