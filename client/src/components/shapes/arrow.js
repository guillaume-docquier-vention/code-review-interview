import { Colors, computeAngle, degreesToRadians, rotate } from "utils";
import { Circle } from "./circle";
import { Line } from "./line";
import { Shape } from "./shape";

// TODO The rotation behaviour is baked in but shouldn't
export class Arrow extends Shape {
    constructor(start, end, width, options = {}) {
        super();

        this.width = width;

        this._mousedDown = false;
        this._isDragging = false;

        this.lineOptions = { strokeStyle: Colors.COMMUNITY };
        this.shaft = new Line(start, end, width, this.lineOptions);
        this.setHeads();

        const anchorPoint = rotate({ x: this.length / 2, y: 0 }, this.angle);
        this.anchorPoint = new Circle(this.shaft.start.x + anchorPoint.x, this.shaft.start.y + anchorPoint.y, 4);
    }

    get length() {
        return Math.sqrt((this.shaft.start.x - this.shaft.end.x)**2 + (this.shaft.start.y - this.shaft.end.y)**2)
    }

    get angle() {
        return computeAngle(this.shaft.start, this.shaft.end);
    }

    setHeads() {
        const headLength = this.length / 4;
        const shaftAngle = this.angle;

        const leftHeadEnd = rotate({ x: headLength, y: 0 }, degreesToRadians(135) + shaftAngle);
        this.leftHead = new Line(
            this.shaft.end,
            new Circle(this.shaft.end.x + leftHeadEnd.x, this.shaft.end.y + leftHeadEnd.y),
            this.width,
            this.lineOptions
        );

        const rightHeadEnd = rotate({ x: headLength, y: 0 }, degreesToRadians(-135) + shaftAngle);
        this.rightHead = new Line(
            this.shaft.end,
            new Circle(this.shaft.end.x + rightHeadEnd.x, this.shaft.end.y + rightHeadEnd.y),
            this.width,
            this.lineOptions
        );
    }

    contains(position) {
        return this.shaft.contains(position) ||
            this.leftHead.contains(position) ||
            this.rightHead.contains(position);
    }

    render(ctx) {
        ctx.lineWidth = this.width;

        this.leftHead.render(ctx);
        this.rightHead.render(ctx);
        this.shaft.render(ctx);
    }

    onMouseDown(position) {
        this._mousedDown = true;
    }

    onMouseMove(position, delta) {
        if (this._mousedDown) {
            this._isDragging = true;

            // Rotate the shaft
            const newAngle = computeAngle(position, this.anchorPoint);
            const pivotPiece = { x: this.length / 2, y: 0 }

            const shaftStart = rotate(pivotPiece, newAngle);
            this.shaft.start.x = this.anchorPoint.x + shaftStart.x;
            this.shaft.start.y = this.anchorPoint.y + shaftStart.y;

            const shaftEnd = rotate(pivotPiece, newAngle - degreesToRadians(180));
            this.shaft.end.x = this.anchorPoint.x + shaftEnd.x;
            this.shaft.end.y = this.anchorPoint.y + shaftEnd.y;

            this.setHeads();
        }
    }

    drag(delta) {
    }

    onMouseUp(position) {
        if (this._mousedDown && !this._isDragging) {
            console.log("I WAS CLICKED");
        }

        this._mousedDown = false;
        this._isDragging = false;
    }
}
