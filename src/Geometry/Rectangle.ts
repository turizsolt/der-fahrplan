export class Rectangle {

    public constructor(
        public top: number,
        public left: number,
        public bottom: number,
        public right: number
    ) {};

    public getWidth(): number {
        return this.right-this.left;
    }

    public getHeight(): number {
        return this.bottom-this.top;
    }

    public getPositionStyle(): object {
        return {
            height: this.getHeight()+"px",
            left: this.left+"px",
            top: this.top+"px", 
            width: this.getWidth()+"px",             
        };
    }
}
