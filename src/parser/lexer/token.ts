import TokenType from "./token.type";

export default class Token {
    constructor(
        public readonly text: string,
        public readonly type: TokenType,
        public readonly row: number = 0,
        public readonly column: number = 0
    ) {}
}