import { Shape } from "./shape";
import { Line } from "./line";
import { WIND_SPEED } from "constants";
import { BOB_MASS } from "constants";

export class Pendulum extends Shape {
    constructor(pivot, bob, rodWidth) {
        super();

        this.pivot = pivot;
        this.rod = new Line(pivot, bob, rodWidth, { dragAxis: { x: true } });
        this.bob = bob;

        this.wind = {
            speed: WIND_SPEED,
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

    // TODO We're mixing model and shape
    toJson() {
        return {
            pivotPosition: { x: this.pivot.x, y: this.pivot.y },
            bobPosition: { x: this.bob.x, y: this.bob.y },
            angle: this.rod.angle,
            mass: BOB_MASS,
            bobRadius: this.bob.radius,
            wind: this.wind,
        };
    }
}
