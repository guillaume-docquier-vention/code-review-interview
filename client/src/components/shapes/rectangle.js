import { Shape } from "./shape";

export class Rectangle extends Shape {
    constructor(x, y, width, height, onClick) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.onClick = onClick;

        this._mousedDown = false;
        this._isDragging = false;
    }

    contains(position) {
        return position.x >= this.x &&
            position.x <= this.x + this.width &&
            position.y >= this.y &&
            position.y <= this.y + this.height;
    }

    render(ctx) {
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    onMouseDown(position) {
        this._mousedDown = true;
    }

    onMouseMove(position, delta) {
        if (this._mousedDown) {
            this._isDragging = true;
            this.x += delta.x;
            this.y += delta.y;
        }
    }

    onMouseUp(position) {
        if (this._mousedDown && !this._isDragging) {
            console.log("I WAS CLICKED");
            this.onClick();
        }

        this._mousedDown = false;
        this._isDragging = false;
    }
}
