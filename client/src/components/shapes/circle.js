import { Shape } from "./shape";

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
}
