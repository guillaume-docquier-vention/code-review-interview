import type { Point } from '../../utils/Point'
import type { Velocity } from '../../utils/Velocity'
import type { PendulumJson } from './PendulumJson'
import { MS_PER_SECONDS } from '../../constants'
import { computeAngle, degreesToRadians } from '../../utils'

export class Pendulum {
    private initialState: {
        gravity: number;
        mass: number;
        angle: number;
        pivotPosition: Point;
        bobPosition: Point;
        bobRadius: number;
        speed: number;
        wind: Velocity
    }
    private pivotPosition!: Point
    private bobPosition!: Point
    private mass!: number
    private bobRadius!: number
    private wind!: Velocity
    private gravity!: number
    private speed!: number

    public constructor(pivotPosition: Point, bobPosition: Point, angle: number, mass: number, bobRadius: number, wind: Velocity, gravity: number) {
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

    public tick(tickTimeMs: number): void {
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

    public reset(): void {
        this.pivotPosition = { ...this.initialState.pivotPosition };
        this.bobPosition = { ...this.initialState.bobPosition };
        this.mass = this.initialState.mass;
        this.bobRadius = this.initialState.bobRadius;
        this.wind = { ...this.initialState.wind };
        this.gravity = this.initialState.gravity;
        this.speed = this.initialState.speed;
    }

    public detectCollision(pendulum: PendulumJson): boolean {
        const distanceBetweenPendulums = Math.sqrt((pendulum.bobPosition.x - this.bobPosition.x) ** 2 + (pendulum.bobPosition.y - this.bobPosition.y) ** 2);

        return distanceBetweenPendulums <= pendulum.bobRadius + this.bobRadius;
    }

    public toJson(): PendulumJson {
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

    private get angle(): number {
        // Angle from horizontal line (0, 0) -> (0, 1)
        const dx = this.bobPosition.x - this.pivotPosition.x;
        const dy = this.bobPosition.y - this.pivotPosition.y;

        let radianAngle = Math.atan2(dy, dx);
        if (radianAngle < 0) {
            radianAngle += degreesToRadians(360); // Make it [0, 360]
        }

        return radianAngle;
    }

    public get rodLength(): number {
        return Math.sqrt((this.pivotPosition.x - this.bobPosition.x) ** 2 + (this.pivotPosition.y - this.bobPosition.y) ** 2);
    }
}
