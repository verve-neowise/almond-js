import { Executable, Types, Value } from "./";

export default interface Context {

    isConst(text: string): boolean;
    
    result: Value | undefined;

    return(value: Value): void;
    
    declare(name: string, value: Value, type: Types, isConst: boolean): void;
    typeOf(name: string): Types;
    isExists(name: string): boolean;
    set(name: string, value: Value): void;
    get(name: string): Value

    function(name: string, executable: Executable): void;

    apply(extension: (context: Context) => void): void;
}