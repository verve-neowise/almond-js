import Context from "../src/runtime/Context";
import Value from "../src/runtime/value/Value";

export default class TestContext implements Context {
    
    private variables: Map<string, Value> = new Map();
    
    declareVariable(name: string, value: Value): void {
        this.variables.set(name, value);
    }
    
    getVariable(name: string): Value {
        return this.variables.get(name);
    }
} 