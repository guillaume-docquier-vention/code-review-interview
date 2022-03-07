import { Shape } from "./shape";
import { Line } from "./line";

export class Pendulum extends Shape {
    constructor(pivot, bob, rodWidth) {
        super();

        this.pivot = pivot;
        this.rod = new Line(pivot, bob, rodWidth);
        this.bob = bob;

        this.parts = [this.pivot, this.bob, this.rod];
    }

    contains(x, y) {
        return this.parts.some(part => part.contains(x, y));
    }

    // TODO Add 'mousedown', 'drag', etc and let the parts do their behaviour

    // TODO adapt this
    static fromJson(json) {
        return new Pendulum(
            json.x,
            json.y,
            json.radius
        );
    }

    // TODO adapt this
    toJson() {
        return {
            x: this.x,
            y: this.y,
            stringLength: this.stringLength,
            angularOffset: this.angularOffset,
            mass: this.mass,
            radius: this.radius,
            wind: this.wind,
        };
    }
}
