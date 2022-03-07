import { degreesToRadians } from "utils";
import { Shape } from "./shape";

const DEFAULT_LINE_WIDTH = 2;
export class Circle extends Shape {
    constructor(x, y, radius) {
        super();

        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    contains(x, y) {
        const offset = {
            x: x - this.x,
            y: y - this.y
        };

        return Math.sqrt(offset.x**2 + offset.y**2) <= this.radius;
    }

    render(ctx) {
        ctx.fillStyle = "darkred";
        ctx.strokeStyle = "black";
        ctx.lineWidth = DEFAULT_LINE_WIDTH;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, degreesToRadians(0), degreesToRadians(360));
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}
