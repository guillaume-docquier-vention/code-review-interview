import { degreesToRadians } from "utils";
import { Shape } from "./shape";

const DEFAULT_LINE_WIDTH = 2;
export class Circle extends Shape {
    constructor(x, y, radius, options = {}) {
        super();

        this.x = x;
        this.y = y;
        this.radius = radius;

        this.dragAxis = options.dragAxis || { x: true, y: true };
        this.fillStyle = options.fillStyle || "darkred";
        this.strokeStyle = options.strokeStyle || "black";
        this.lineWidth = options.lineWidth || DEFAULT_LINE_WIDTH;

        this._mousedDown = false;
        this._isDragging = false;
    }

    contains(position) {
        const offset = {
            x: position.x - this.x,
            y: position.y - this.y
        };

        return Math.sqrt(offset.x**2 + offset.y**2) <= this.radius;
    }

    render(ctx) {
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, degreesToRadians(0), degreesToRadians(360));
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }

    onMouseDown(position) {
        this._mousedDown = true;
    }

    onMouseMove(position, delta) {
        if (this._mousedDown) {
            this._isDragging = true;
            this.drag(delta);
        }
    }

    drag(delta) {
        if (this.dragAxis.x) {
            this.x += delta.x;
        }

        if (this.dragAxis.y) {
            this.y += delta.y;
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
