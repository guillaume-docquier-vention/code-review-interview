import { MS_PER_SECONDS } from "../constants";
import { degreesToRadians } from "../angles";

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
        return Math.sqrt((this.pivotPosition.x - this.bobPosition.x) ** 2 + (this.pivotPosition.y - this.bobPosition.y) ** 2);
    }

    tick(tickTimeMs) {
        const { angle, rodLength } = this;
        const tickTimeSeconds = tickTimeMs / MS_PER_SECONDS;

        // Update speed
        const angleToGravity = angle - degreesToRadians(90); // Angle with g force
        const acceleration = this.gravity * Math.sin(angleToGravity);
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
        this.wind = this.initialState.wind;
        this.gravity = this.initialState.gravity;
        this.speed = this.initialState.speed;
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
