import ValueType from "./ValueType";

export default interface Value {

    asString(): string;
    asNumber(): number;

    type(): ValueType;
}