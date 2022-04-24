import { Unary } from "."
import { Value, Types } from "../";

export const positive: Unary = (right: Value): Value => {
    if (right.type === Types.Number) {
        return right
    }
    if (right.type === Types.String) {
        return new Value(+right.value, Types.Number)
    }
    throw new Error(`Cannot apply unary + to ${right.type}`)
}

export const negative: Unary = (right: Value): Value => {
    if (right.type === Types.Number) {
        return new Value(-right.value, Types.Number)
    }
    throw new Error(`Cannot apply unary - to ${right.type}`)
}

export const not: Unary = (right: Value): Value => {
    if (right.type === Types.Boolean) {
        return new Value(!right.value, Types.Boolean)
    }
    throw new Error(`Cannot apply unary ! to ${right.type}`)
}