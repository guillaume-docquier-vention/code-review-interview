import { Shape } from "./shape";

export class Line extends Shape {
    constructor(start, end, width) {
        super();

        this.start = start;
        this.end = end;
        this.width = width;
        this.length = Math.sqrt((start.x - end.x)**2 + (start.y - end.y)**2);
        this.angle = Math.asin((start.y - end.y) / this.length);

        this._mousedDown = false;
        this._isDragging = false;
    }

    contains(position) {
        // y ± width = ax + b;
        const a = (this.start.y - this.end.y) / (this.start.x - this.end.x);
        const b = this.start.y - a * this.start.x;
        const expectedY = a * position.x + b;

        return expectedY <= position.y + this.width && expectedY >= position.y - this.width;
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

    onMouseDown(position) {
        this._mousedDown = true;
    }

    onMouseMove(position, delta) {
        if (this._mousedDown) {
            this._isDragging = true;
            // TODO Consider having a drag method to force start and end to drag?
            this.start.x += delta.x;
            this.start.y += delta.y;
            this.end.x += delta.x;
            this.end.y += delta.y;
        }
    }

    onMouseUp(position) {
        if (this._mousedDown && !this._isDragging) {
            console.log("I WAS CLICKED");
        }

        this._mousedDown = false;
        this._isDragging = false;
    }
}
