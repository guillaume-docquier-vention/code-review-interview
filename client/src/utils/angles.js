export const degreesToRadians = degrees => {
    return degrees * Math.PI / 180;
}

export const radiansToDegrees = radians => {
    return radians * 180 / Math.PI;
}

export const rotate = (position, angle) => ({
    x: position.x * Math.cos(angle) - position.y * Math.sin(angle),
    y: position.x * Math.sin(angle) + position.y * Math.cos(angle),
});

export const computeAngle = (start, end) => {
        // Angle from horizontal line (0, 0) -> (0, 1)
        const dx = end.x - start.x;
        const dy = end.y - start.y;

        let radianAngle = Math.atan2(dy, dx);
        if (radianAngle < 0) {
            radianAngle += degreesToRadians(360);
        }

        return radianAngle;
};
