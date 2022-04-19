export type Rollback = {
    position: number;
    row: number;
    column: number;
}

export class Source {

    private source: string;

    position: number = 0
    row: number = 0
    column: number = 0

    length: number;

    constructor(source: string) {
        this.source = source;
        console.log(source);
        this.length = source.length;
    }

    end(): boolean {
        return this.position >= this.length;
    }

    next(): string {
        this.position++;
        
        let result = this.peek(0);
        
        if (result === '\n') {
            this.row++;
            this.column = 1;
        }
        else {
            this.column++;
        }
        return result;
    }

    peek(relative: number): string {
        let position = this.position + relative
        if (position < 0 || position >= this.length) {
            console.log( `out side source` );
            console.log(this.end());
            return '\u0000'
        }
        return this.source.charAt(position)
    }

    rollback(): Rollback {
        return {
            position: this.position,
            row: this.row,
            column: this.column
        }
    }

    restore(rollback: Rollback) {
        this.position = rollback.position;
        this.row = rollback.row;
        this.column = rollback.column;
    }

    positionToString() {
        return `${this.row}:${this.column}`
    }
}