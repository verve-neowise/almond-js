
export class BreakError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "BreakError";
    }
}

export class ContinueError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ContinueError";
    }
}

export class ReturnError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "ReturnError";
    }
}