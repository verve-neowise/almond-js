import { Context, Types, Value } from "../../runtime";
import Void from "../../runtime/value/void";

export default (context: Context) => {
    context.function('print', (context, args) => {
        console.log(...(args.map(arg => arg.value)));
        return new Void()
    })

    context.function('multiply', (context, args) => {
        return new Value(args[0].value * args[1].value, Types.Number)
    })
}