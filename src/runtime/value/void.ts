import { Types, Value } from "..";

export default class Void extends Value {
    constructor() {
        super(null, Types.Void);
    }
}