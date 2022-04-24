import { Value } from ".";
import Context from "./context";

type Executable = (context: Context, args: Value[]) => Value

export default Executable