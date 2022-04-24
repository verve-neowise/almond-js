import { Value } from "./";

export default interface Context {
    declareVariable(name: string, value: Value): void;
    getVariable(name: string): Value | undefined;
}