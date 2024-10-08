import type { Point } from '../../utils/Point'
import type { Velocity } from '../../utils/Velocity'
import type { PendulumJson } from './PendulumJson'

export class Pendulum {
    public constructor(pivotPosition: Point, bobPosition: Point, angle: number, mass: number, bobRadius: number, wind: Velocity, gravity: number) {
        throw new Error("Not implemented yet")
    }

    public tick(tickTimeMs: number): void {
        throw new Error("Not implemented yet")
    }

    public reset(): void {
        throw new Error("Not implemented yet")
    }

    public detectCollision(pendulum: PendulumJson): boolean {
        throw new Error("Not implemented yet")
    }

    public toJson(): PendulumJson {
        throw new Error("Not implemented yet")
    }
}
