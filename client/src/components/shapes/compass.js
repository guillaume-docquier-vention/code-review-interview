import { Arrow } from "./arrow";
import { Circle } from "./circle";
import { Shape } from "./shape";

export class Compass extends Shape {
    constructor(center, radius, options = {}) {
        super();

        this.onDragEnd = options.onDragEnd;

        this._mousedDown = false;
        this._isDragging = false;

        this.arrow = new Arrow(
            new Circle(center.x - radius * 0.85, center.y),
            new Circle(center.x + radius * 0.85, center.y),
            8
        );
        this.ring = new Circle(center.x, center.y, radius, { fillStyle: options.backgroundColor });
    }

    contains(position) {
        return this.arrow.contains(position);
    }

    render(ctx) {
        this.ring.render(ctx);
        this.arrow.render(ctx);
    }

    // TODO Abstract clicked and drag flags
    onMouseDown(position) {
        if (this.contains(position)) {
            this.arrow.onMouseDown(position);
            this._mousedDown = true;
        }
    }

    onMouseMove(position, delta) {
        this.arrow.onMouseMove(position, delta);
        this._isDragging = this._mousedDown;
    }

    onMouseUp(position) {
        this.arrow.onMouseUp(position);
        if (this._isDragging) {
            this.onDragEnd(this.arrow.angle);
        }

        this._mousedDown = false;
        this._isDragging = false;
    }
}
