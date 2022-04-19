import Value from "./Value";
import ValueType from "./ValueType";

export default class StringValue implements Value {

    constructor(private value: string) {}

    public asString(): string {
        return this.value;
    }

    public asNumber(): number {
        return parseFloat(this.value);
    }

    public type(): ValueType {
        return ValueType.String;
    }
}