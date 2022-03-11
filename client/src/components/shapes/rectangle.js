import { Shape } from "./shape";

export class Rectangle extends Shape {
    constructor(x, y, width, height, options = {}) {
        super();

        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;

        this.onClick = options.onClick;
        this.isDraggable = !!options.isDraggable;
        this.stroked = options.stroked;

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
        if (this.stroked) {
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        } else {
            ctx.fillRect(this.x, this.y, this.width, this.height);
        }
    }

    onMouseDown(position) {
        if (this.contains(position)) {
            this._mousedDown = true;
        }
    }

    onMouseMove(position, delta) {
        if (this._mousedDown) {
            if (this.isDraggable) {
                this._isDragging = true;
                this.drag(delta);
            }
        }
    }

    drag(delta) {
        this.x += delta.x;
        this.y += delta.y;
    }

    onMouseUp(position) {
        if (this._mousedDown && !this._isDragging && this.contains(position)) {
            console.log("I WAS CLICKED");
            if (this.onClick) {
                this.onClick();
            }
        }

        this._mousedDown = false;
        this._isDragging = false;
    }
}
