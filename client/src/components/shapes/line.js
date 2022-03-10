import { Colors, degreesToRadians } from "utils";
import { Shape } from "./shape";

export class Line extends Shape {
    constructor(start, end, width, options = {}) {
        super();

        this.start = start;
        this.end = end;
        this.width = width;

        this.dragAxis = options.dragAxis || { x: true, y: true };
        this.fillStyle = options.fillStyle || Colors.SECONDARY;
        this.strokeStyle = options.strokeStyle || Colors.PRIMARY;

        this._mousedDown = false;
        this._isDragging = false;
    }

    get length() {
        return Math.sqrt((this.start.x - this.end.x)**2 + (this.start.y - this.end.y)**2)
    }

    get angle() {
        // Angle from horizontal line (0, 0) -> (0, 1)
        const dx = this.end.x - this.start.x;
        const dy = this.end.y - this.start.y;

        let radianAngle = Math.atan2(dy, dx);
        if (radianAngle < 0) {
            radianAngle += degreesToRadians(360);
        }

        return radianAngle;
    }

    contains(position) {
        // TODO This is hacky
        if (this.start.contains(position) || this.end.contains(position)) {
            return false;
        }

        const lineLength = this.length;
        const lineAngle = this.angle;

        // Find 4 corners
        const horizontalWidth = this.width / 2 * Math.sin(lineAngle);
        const verticalWidth = this.width / 2 * Math.cos(lineAngle);
        const corners = {
            topRight: { x: this.start.x + horizontalWidth, y: this.start.y - verticalWidth },
            bottomRight: { x: this.end.x + horizontalWidth, y: this.end.y - verticalWidth },
            bottomLeft: { x: this.end.x - horizontalWidth, y: this.end.y + verticalWidth },
            topLeft: { x: this.start.x - horizontalWidth, y: this.start.y + verticalWidth },
        };

        // Make 4 triangles
        const triangles = [
            [position, corners.topRight, corners.bottomRight],
            [position, corners.bottomRight, corners.bottomLeft],
            [position, corners.bottomLeft, corners.topLeft],
            [position, corners.topLeft, corners.topRight],
        ];

        // Compare areas
        const lineArea = lineLength * this.width;
        const trianglesArea = triangles.map(getTriangleArea).reduce(sum, 0);

        return Math.round(lineArea) === Math.round(trianglesArea);
    }

    render(ctx) {
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
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
            if (this.dragAxis.x) {
                this.drag({ x: delta.x, y: 0 });
            }

            if (this.dragAxis.y) {
                this.drag({ x: 0, y: delta.y });
            }
        }
    }

    drag(delta) {
        this.start.drag(delta);
        this.end.drag(delta);
    }

    onMouseUp(position) {
        if (this._mousedDown && !this._isDragging) {
            console.log("I WAS CLICKED");
        }

        this._mousedDown = false;
        this._isDragging = false;
    }
}

function getTriangleArea([point1, point2, point3]) {
    return Math.abs(
        point1.x * point2.y + point2.x * point3.y + point3.x * point1.y -
        point1.y * point2.x - point2.y * point3.x - point3.y * point1.x
    ) / 2;
}

function sum(acc, value) {
    return acc + value;
}
