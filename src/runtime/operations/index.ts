import Value from "../value/value";

export type Binary = (left: Value, right: Value) => Value;

export type Unary = (right: Value) => Value;