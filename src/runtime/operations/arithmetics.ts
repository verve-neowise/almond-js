import { Binary } from ".";
import { Value, Types } from "..";

export const plus: Binary = (left: Value, right: Value): Value => {
    if (left.type == Types.String) {
        return new Value(left.value + right.value, Types.String);
    }
    else if (left.type == Types.Number) {
        return new Value(left.value + right.value, Types.Number);
    }
    else {
        throw new Error("Cannot add values of type " + left.type + " and " + right.type);
    }
}

export const minus: Binary = (left: Value, right: Value): Value => {
    if (left.type == Types.Number && right.type == Types.Number) {
        return new Value(left.value - right.value, Types.Number);
    }
    else {
        throw new Error("Cannot subtract values of type " + left.type + " and " + right.type);
    }
}

export const multiply: Binary = (left: Value, right: Value): Value => {
    if (left.type == Types.Number && right.type == Types.Number) {
        return new Value(left.value * right.value, Types.Number);
    }
    else if (left.type == Types.String && right.type == Types.Number) {
        return new Value(left.value.repeat(right.value), Types.String);
    }
    else {
        throw new Error("Cannot multiply values of type " + left.type + " and " + right.type);
    }
}

export const divide: Binary = (left: Value, right: Value): Value => {
    if (left.type == Types.Number && right.type == Types.Number) {
        return new Value(left.value / right.value, Types.Number);
    }
    else {
        throw new Error("Cannot divide values of type " + left.type + " and " + right.type);
    }
}

export const modulo: Binary = (left: Value, right: Value): Value => {
    if (left.type == Types.Number && right.type == Types.Number) {
        return new Value(left.value % right.value, Types.Number);
    }
    else {
        throw new Error("Cannot modulo values of type " + left.type + " and " + right.type);
    }
}

export const power: Binary = (left: Value, right: Value): Value => {
    if (left.type == Types.Number && right.type == Types.Number) {
        return new Value(Math.pow(left.value, right.value), Types.Number);
    }
    else {
        throw new Error("Cannot power values of type " + left.type + " and " + right.type);
    }
}