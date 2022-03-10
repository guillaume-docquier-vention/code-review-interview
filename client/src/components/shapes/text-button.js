import { Rectangle } from "./rectangle";
import { Shape } from "./shape";
import{ Colors } from "utils";

export class TextButton extends Shape {
    constructor(x, y, text, options) {
        super();

        this.x = x;
        this.y = y;
        this.text = text;

        this.onClick = options.onClick;
        this.backgroundColor = options.backgroundColor || Colors.PRIMARY;
        this.textColor = options.textColor || Colors.PRIMARY_TEXT;
        this.disabled = options.disabled;

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
        ctx.fillStyle = this.backgroundColor;
        if (this.disabled) {
            ctx.fillStyle = "#9EADC7";
        }
        this.buttonBox.render(ctx);

        ctx.fillStyle = this.textColor;
        if (this.disabled) {
            ctx.fillStyle = "#CED7E5";
        }
        ctx.fillText(this.text, this.x, this.y);

        ctx.closePath();
    }

    onMouseDown(position) {
        if (this.buttonBox && !this.disabled) {
            this.buttonBox.onMouseDown(position);
        }
    }

    onMouseMove(position, delta) {
        if (this.buttonBox && !this.disabled) {
            this.buttonBox.onMouseMove(position, delta);
        }
    }

    onMouseUp(position) {
        if (this.buttonBox && !this.disabled) {
            this.buttonBox.onMouseUp(position);
        }
    }
}