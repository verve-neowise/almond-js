import Context from "./context";
import Value from "./value/value";
import ArrayValue from "./value/array";
import Types from "./value/types";
import * as Arithmetics from "./operations/arithmetics"
// import * as Conditional from "./operations/conditional"
import * as Unary from "./operations/unary"
import Executable from "./executable";
import FunctionValue from "./value/function";

function typeOf(name: string) {
    switch (name) {
        case 'null':
            return Types.Null;
        case 'boolean':
            return Types.Boolean;
        case 'number':
            return Types.Number;
        case 'string':
            return Types.String;
        case 'object':
            return Types.Object;
        case 'array':
            return Types.Array;
        case 'function':
            return Types.Function;
        case 'void':
            return Types.Void;
        default:
            throw new Error(`Unknown type: ${name}`);
    }
}

export {
    Context,
    Executable,
    Value,
    ArrayValue,
    Types,
    Arithmetics,
    Unary,
    typeOf,
    FunctionValue
}