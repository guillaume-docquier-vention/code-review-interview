import { Shape } from "./shape";

export class Rectangle extends Shape {
    constructor(x, y, width, height) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(x, y) {
        return x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height;
    }

    render(ctx) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}
