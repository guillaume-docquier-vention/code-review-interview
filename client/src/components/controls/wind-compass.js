import { Circle, Compass } from "components/shapes";
import { radiansToDegrees } from "utils";

const COMPASS_RADIUS = 60;

export const WindCompass = (x, y, pendulums) => {
    return new Compass(
        new Circle(x, y),
        COMPASS_RADIUS,
        {
            onDragEnd: angle => {
                console.log(`WindCompass is now at ${radiansToDegrees(angle)} degrees`);
                pendulums.forEach(pendulum => {
                    pendulum.shape.wind.angle = angle;
                });
            }
        }
    );
}
