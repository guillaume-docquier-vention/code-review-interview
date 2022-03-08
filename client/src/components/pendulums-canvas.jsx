import React, { useCallback, useState } from "react";
import { getMouseCoords, getMouseDelta, HttpClient } from "utils";
import { Canvas } from "components/canvas";
import { usePolling } from "hooks";
import { SERVER_URL, PENDULUM_ENPOINT, REFRESH_PERIOD } from "constants";
import { TextButton, Circle, Pendulum } from "./shapes";

const PIVOT_RADIUS = 6;
const PENDULUM_RADIUS = 20;
const ROD_WIDTH = 4;

export const PendulumsCanvas = ({ width, height, ...canvasProps}) => {
    const polling = usePolling(SERVER_URL + PENDULUM_ENPOINT, REFRESH_PERIOD, json => {
        pendulum.bob.x = json.x;
        pendulum.bob.y = json.y;
    });

    const [pendulum] = useState(new Pendulum(
        new Circle(width / 2, 0, PIVOT_RADIUS, { dragAxis: { x: true } }),
        new Circle(width / 2, height / 2, PENDULUM_RADIUS),
        ROD_WIDTH
    ));
    const [startButton] = useState(new TextButton(width / 2, height - 15, "START", () => {
        HttpClient.post(SERVER_URL + PENDULUM_ENPOINT, pendulum.toJson(), polling.start);
    }));

    const draw = useCallback(ctx => {
        pendulum.render(ctx);
        startButton.render(ctx);
    }, [pendulum, startButton]);

    const mouseDown = useCallback(e => {
        const position = getMouseCoords(e);

        pendulum.mouseDown(position);
        startButton.mouseDown(position);
    }, [pendulum, startButton]);

    const mouseMove = useCallback(e => {
        const position = getMouseCoords(e);
        const delta = getMouseDelta(e);

        pendulum.mouseMove(position, delta);
        startButton.mouseMove(position, delta);
    }, [pendulum, startButton]);

    const mouseUp = useCallback(e => {
        const position = getMouseCoords(e);

        pendulum.mouseUp(position);
        startButton.mouseUp(position);
    }, [startButton, pendulum]);

    return (
        <Canvas draw={draw} onMouseDown={mouseDown} onMouseMove={mouseMove} onMouseUp={mouseUp} width={width} height={height} {...canvasProps} />
    );
};
