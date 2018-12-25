export class TileModel {
    public type: string;
    public position: number[];

    public constructor(type: string, top: number, left: number) {
        this.type = type;
        this.position = [top, left];
    }

    public onTick() {
        // 
    }
}
