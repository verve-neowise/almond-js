import { Types, Value } from "..";

export default class ArrayValue extends Value {

    constructor(
        public elements: Value[] = [],
    ) {
        super([], Types.Array)
    }

    get(index: number) {
        return this.elements[index];
    }

    set(index: number, value: Value) {
        this.elements[index] = value;
    }

    public get length(): number {
        return this.elements.length;
    }

    get value() {
        return this.elements.map(element => element.value);
    }
}