import { Rectangle } from "./rectangle";
import { Shape } from "./shape";

export class TextButton extends Shape {
    constructor(x, y, text, onClick) {
        super();

        this.x = x;
        this.y = y;
        this.text = text;
        this.onClick = onClick;

        this.buttonBox = null;
    }

    contains(position) {
        return this.buttonBox && this.buttonBox.contains(position);
    }

    render(ctx) {
        ctx.strokeStyle = "black";
        ctx.textAlign = "center";
        ctx.font = "bold 50px sans-serif";

        const padding = 10;
        const textMetrics = ctx.measureText(this.text);

        if (!this.buttonBox) {
            this.buttonBox = new Rectangle(
                this.x - textMetrics.actualBoundingBoxLeft - padding,
                this.y - textMetrics.actualBoundingBoxAscent - padding,
                textMetrics.width + 2 * padding,
                textMetrics.actualBoundingBoxAscent + 2 * padding,
                {
                    onClick: this.onClick,
                },
            );
        }

        ctx.beginPath();
        ctx.fillStyle = "blue";
        this.buttonBox.render(ctx);

        ctx.fillStyle = "darkred";
        ctx.fillText(this.text, this.x, this.y);
        ctx.closePath();
    }

    onMouseDown(position) {
        if (this.buttonBox) {
            this.buttonBox.onMouseDown(position);
        }
    }

    onMouseMove(position, delta) {
        if (this.buttonBox) {
            this.buttonBox.onMouseMove(position, delta);
        }
    }

    onMouseUp(position) {
        if (this.buttonBox) {
            this.buttonBox.onMouseUp(position);
        }
    }
}