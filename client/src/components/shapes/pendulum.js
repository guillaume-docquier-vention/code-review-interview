import { Shape } from "./shape";
import { Line } from "./line";

export class Pendulum extends Shape {
    constructor(pivot, bob, rodWidth) {
        super();

        this.pivot = pivot;
        this.rod = new Line(pivot, bob, rodWidth);
        this.bob = bob;
    }

    contains(x, y) {
        return this.rod.contains(x, y) &&
            this.pivot.contains(x, y) &&
            this.bob.contains(x, y)
    }

    render(ctx) {
        // Render rod first so that it is under the pivot and the bob
        this.rod.render(ctx);

        this.pivot.render(ctx);
        this.bob.render(ctx);
    }

    // TODO Add 'mousedown', 'drag', etc and let the parts do their behaviour

    toJson() {
        return {
            x: this.bob.x,
            y: this.bob.y,
            stringLength: this.rod.length,
            angularOffset: 90 - this.rod.angle,
            mass: 10,
            radius: this.bob.radius,
            wind: 20,
        };
    }
}
