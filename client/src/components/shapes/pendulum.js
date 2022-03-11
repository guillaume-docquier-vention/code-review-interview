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

    onMouseDown(position) {
        this.pivot.onMouseDown(position);
        this.bob.onMouseDown(position);
        this.rod.onMouseDown(position);
    }

    onMouseMove(position, delta) {
        this.pivot.onMouseMove(position, delta);
        this.bob.onMouseMove(position, delta);
        this.rod.onMouseMove(position, delta);
    }

    onMouseUp(position) {
        this.pivot.onMouseUp(position);
        this.bob.onMouseUp(position);
        this.rod.onMouseUp(position);
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
