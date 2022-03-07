import { Shape } from "./shape";

export class Line extends Shape {
    constructor(start, end, width) {
        super();

        this.start = start;
        this.end = end;
        this.width = width;
        this.length = Math.sqrt((start.x - end.x)**2 + (start.y - end.y)**2);
        this.angle = Math.asin((start.y - end.y) / this.length);
    }

    contains(x, y) {
        // y ± width = ax + b;
        const a = (this.start.y - this.end.y) / (this.start.x - this.end.x);
        const b = this.start.y - a * this.start.x;
        const expectedY = a * x + b;

        return expectedY <= y + this.width && expectedY >= y - this.width;
    }

    render(ctx) {
        ctx.fillStyle = "darkred";
        ctx.strokeStyle = "black";
        ctx.lineWidth = this.width;

        ctx.beginPath();
        ctx.moveTo(this.start.x, this.start.y);
        ctx.lineTo(this.end.x, this.end.y);
        ctx.stroke();
        ctx.closePath();
    }
}
