import type { Point } from './Point'

export const degreesToRadians = (degrees: number): number => degrees * (Math.PI / 180);

export const radiansToDegrees = (radians: number): number => radians * (180 / Math.PI);

export const computeAngle = (start: Point, end: Point): number => {
    // Angle from horizontal line (0, 0) -> (0, 1)
    const dx = end.x - start.x;
    const dy = end.y - start.y;

    let radianAngle = Math.atan2(dy, dx);
    if (radianAngle < 0) {
        radianAngle += degreesToRadians(360);
    }

    return radianAngle;
};
