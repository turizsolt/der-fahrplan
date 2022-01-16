import { Route2 } from "./Route2";

export class ActualRoute2 implements Route2 {
    private no: string;
    private color: string;

    constructor(no: string, color: string) {
        this.setNo(no);
        this.setColor(color);
    }

    getNo(): string {
        return this.no;
    }

    setNo(no: string): void {
        this.no = no;
    }

    getColor(): string {
        return this.color;
    }

    setColor(color: string): void {
        this.color = color;
    }
}
