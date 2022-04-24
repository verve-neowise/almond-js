import { Context, Types, Value } from "../../runtime";

export class Accessible {
    get(context: Context): Value { return new Value(undefined, Types.Null); }
    set(context: Context, value: Value): void {  }
}