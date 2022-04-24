enum TokenType {
    // Single-character tokens.

        NUMBER = "<NUMBER>",
        STRING = "<STRING>",
        IDENTIFIER = "<IDENTIFIER>",
        EOF = "<EOF>",

        TRUE = "true",
        FALSE = "false",
        STEP = "step",
    // Multi-character tokens.

        AND = "&&",
        OR = "||",
        EQ = "==",
        NEQ = "!=",
        LT = "<",
        GT = ">",
        LEQ = "<=",
        GEQ = ">=",
        PLUS = "+",
        MINUS = "-",
        MUL = "*",
        DIV = "/",
        MOD = "%",
        NOT = "!",
        ASSIGN = "=",
        LPAREN = "(",
        RPAREN = ")",
        LBRACE = "{",
        RBRACE = "}",
        LBRACKET = "[",
        RBRACKET = "]",
        COMMA = ",",
        SEMICOLON = ";",
        COLON = ":",
        COLONCOLON = "::",
        FUNCTIONAL = "=>",
        DOT = ".",
        QUESTION = "?",
        ELVIS = "?:",
        AT = "@",
        ELLIPSIS = "...",
        HASH = "#",
        TILDE = "~",
        INCREMENT = "++",
        DECREMENT = "--",
        PLUS_EQ = "+=",
        MINUS_EQ = "-=",
        MUL_EQ = "*=",
        DIV_EQ = "/=",
        MOD_EQ = "%=",
        AND_EQ = "&=",
        OR_EQ = "|=",
        XOR_EQ = "^=",
        XOR = "^",

    // basic Keywords.
        
        IF = "if",
        ELSE = "else",

        WHILE = "while",
        DO = "do",

        FOR = "for",
        TO = "to",
        DOWNTO = "downto",
        REPEAT = "repeat",
        
        BREAK = "break",
        CONTINUE = "continue",

        FUNCTION = "function",
        RETURN = "return",

        LET = "let",
        CONST = "const",

        ERROR = 'error',
}

export default TokenType;