import { Shape } from "./shape";
import { Line } from "./line";

export class Pendulum extends Shape {
    constructor(pivot, bob, rodWidth) {
        super();

        this.pivot = pivot;
        this.rod = new Line(pivot, bob, rodWidth, { dragAxis: { x: true } });
        this.bob = bob;

        this.wind = {
            speed: 1,
            angle: 0
        }
    }

    contains(position) {
        return this.rod.contains(position) ||
            this.pivot.contains(position) ||
            this.bob.contains(position)
    }

    render(ctx) {
        // Render rod first so that it is under the pivot and the bob
        this.rod.render(ctx);

        this.pivot.render(ctx);
        this.bob.render(ctx);
    }

    mouseDown(position) {
        this.pivot.mouseDown(position);
        this.bob.mouseDown(position);
        this.rod.mouseDown(position);
    }

    mouseMove(position, delta) {
        this.pivot.mouseMove(position, delta);
        this.bob.mouseMove(position, delta);
        this.rod.mouseMove(position, delta);
    }

    mouseUp(position) {
        this.pivot.mouseUp(position);
        this.bob.mouseUp(position);
        this.rod.mouseUp(position);
    }

    toJson() {
        return {
            pivotPosition: { x: this.pivot.x, y: this.pivot.y },
            bobPosition: { x: this.bob.x, y: this.bob.y },
            angle: this.rod.angle,
            mass: 1,
            bobRadius: this.bob.radius,
            wind: this.wind,
        };
    }
}
