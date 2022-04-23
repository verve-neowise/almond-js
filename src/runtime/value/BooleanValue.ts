import Value from "./Value";
import ValueType from "./ValueType";

export default class BooleanValue implements Value {


    constructor(public value: boolean) { }

    public asString(): string {
        return this.value.toString();
    }

    public asNumber(): number {
        throw new Error("BooleanValue cannot be converted to number");
    }

    public type(): ValueType {
        return ValueType.Boolean;
    }
}