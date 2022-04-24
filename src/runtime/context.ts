import { Executable, Value } from "./";

export default interface Context {
    
    result: Value | undefined;

    return(value: Value): void;
    
    declare(name: string, value: Value, isConst: boolean): void;
    isExists(name: string): boolean;
    set(name: string, value: Value): void;
    get(name: string): Value

    function(name: string, executable: Executable): void;

    apply(extension: (context: Context) => void): void;
}