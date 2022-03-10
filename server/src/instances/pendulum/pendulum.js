import { computeAngle, degreesToRadians, getDistance } from "../../utils";
import { MS_PER_SECONDS } from "../../constants";

export class Pendulum {
    constructor(pivotPosition, bobPosition, angle, mass, bobRadius, wind, gravity) {
        this.initialState = {
            pivotPosition,
            bobPosition,
            angle,
            mass,
            bobRadius,
            wind,
            gravity,
            speed: 0,
        };

        this.reset();
    }

    get angle() {
        // Angle from horizontal line (0, 0) -> (0, 1)
        const dx = this.bobPosition.x - this.pivotPosition.x;
        const dy = this.bobPosition.y - this.pivotPosition.y;

        let radianAngle = Math.atan2(dy, dx);
        if (radianAngle < 0) {
            radianAngle += degreesToRadians(360); // Make it [0, 360]
        }

        return radianAngle;
    }

    get rodLength() {
        return getDistance(this.pivotPosition, this.bobPosition);
    }

    tick(tickTimeMs) {
        const { angle, rodLength } = this;
        const tickTimeSeconds = tickTimeMs / MS_PER_SECONDS;

        // Resolve forces
        const gForce = {
            x: 0,
            y: this.gravity * this.mass,
        };
        const windForce = {
            x: this.wind.speed * this.bobRadius * Math.cos(this.wind.angle) * -1, // Wind applies a force against you
            y: this.wind.speed * this.bobRadius * Math.sin(this.wind.angle) * -1,
        };
        const resultingForce = {
            x: gForce.x + windForce.x,
            y: gForce.y + windForce.y,
        };

        const forceMagnitude = Math.sqrt(resultingForce.x ** 2 + resultingForce.y ** 2);
        const forceAngle = computeAngle({ x: 0, y: 0 }, resultingForce);

        const angleToForce = angle - forceAngle;
        const acceleration = forceMagnitude * Math.sin(angleToForce);

        // Update speed
        this.speed += acceleration * tickTimeSeconds;

        // Get distance traveled
        const arcLength = this.speed * tickTimeSeconds;
        const arcAngle = arcLength / rodLength;

        // Update bob position
        this.bobPosition.x = this.pivotPosition.x + rodLength * Math.cos(angle + arcAngle);
        this.bobPosition.y = this.pivotPosition.y + rodLength * Math.sin(angle + arcAngle);
    }

    reset() {
        this.pivotPosition = { ...this.initialState.pivotPosition };
        this.bobPosition = { ...this.initialState.bobPosition };
        this.mass = this.initialState.mass;
        this.bobRadius = this.initialState.bobRadius;
        this.wind = { ...this.initialState.wind };
        this.gravity = this.initialState.gravity;
        this.speed = this.initialState.speed;
    }

    detectCollision(pendulum) {
        const distanceBetweenPendulums = getDistance(pendulum.bobPosition, this.bobPosition);

        return distanceBetweenPendulums <= pendulum.bobRadius + this.bobRadius;
    }

    toJson() {
        return {
            pivotPosition: this.pivotPosition,
            bobPosition: this.bobPosition,
            angle: this.angle,
            mass: this.mass,
            bobRadius: this.bobRadius,
            wind: this.wind,
            gravity: this.gravity,
            speed: this.speed,
        };
    }
}
