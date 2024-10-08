import type { Point } from '../../utils/Point'
import type { Velocity } from '../../utils/Velocity'

export type PendulumJson = {
  pivotPosition: Point
  bobPosition: Point
  angle: number
  mass: number
  bobRadius: number
  wind: Velocity
  gravity: number
  speed: number
}
