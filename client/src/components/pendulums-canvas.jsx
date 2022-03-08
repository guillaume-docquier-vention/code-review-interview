import React, { useCallback, useState } from "react";
import { getMouseCoords, getMouseDelta, HttpClient } from "utils";
import { Canvas } from "components/canvas";
import { usePolling } from "hooks";
import { SERVER_URL, PENDULUM_ENDPOINT, REFRESH_PERIOD } from "constants";
import { TextButton, Circle, Pendulum } from "./shapes";

const PIVOT_RADIUS = 6;
const PENDULUM_RADIUS = 20;
const ROD_WIDTH = 4;

export const PendulumsCanvas = ({ width, height, ...canvasProps}) => {
    const [pendulums] = useState([1, 2, 3, 4, 5].map(i =>
        ({
            shape: new Pendulum(
                new Circle(i * width / 6, 0, PIVOT_RADIUS, { dragAxis: { x: true } }),
                new Circle(i * width / 6, height / 2, PENDULUM_RADIUS),
                ROD_WIDTH
            ),
            server: `${SERVER_URL}:300${i}/${PENDULUM_ENDPOINT}`,
        })
    ));
    
    const polling = usePolling(pendulums.map(pendulum => pendulum.server), REFRESH_PERIOD, (json, i) => {
        pendulums[i].shape.bob.x = json.bobPosition.x;
        pendulums[i].shape.bob.y = json.bobPosition.y;
    });

    const [startButton] = useState(new TextButton(width / 2, height - 15, "START", () => {
        pendulums.forEach(pendulum =>
            HttpClient.post(pendulum.server, pendulum.shape.toJson(), polling.start)
        )
    }));

    const draw = useCallback(ctx => {
        pendulums.forEach(pendulum => pendulum.shape.render(ctx));
        startButton.render(ctx);
    }, [pendulums, startButton]);

    const mouseDown = useCallback(e => {
        const position = getMouseCoords(e);

        pendulums.forEach(pendulum => pendulum.shape.mouseDown(position));
        startButton.mouseDown(position);
    }, [pendulums, startButton]);

    const mouseMove = useCallback(e => {
        const position = getMouseCoords(e);
        const delta = getMouseDelta(e);

        pendulums.forEach(pendulum => pendulum.shape.mouseMove(position, delta));
        startButton.mouseMove(position, delta);
    }, [pendulums, startButton]);

    const mouseUp = useCallback(e => {
        const position = getMouseCoords(e);

        pendulums.forEach(pendulum => pendulum.shape.mouseUp(position));
        startButton.mouseUp(position);
    }, [pendulums, startButton]);

    return (
        <Canvas draw={draw} onMouseDown={mouseDown} onMouseMove={mouseMove} onMouseUp={mouseUp} width={width} height={height} {...canvasProps} />
    );
};
