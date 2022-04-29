import { Token } from "./lexer";

export class Position {
    constructor(
        public readonly start: Token,
        public readonly end: Token
    ) { }
}
