import { Token } from "./lexer";

export class Position {
    constructor(
        public start: Token,
        public end: Token
    ) { }
}
