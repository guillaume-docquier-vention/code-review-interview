import React, { useCallback, useState } from "react";
import { getMouseCoords, getMouseDelta, HttpClient } from "utils";
import { Canvas } from "components/canvas";
import { usePolling } from "hooks";
import { SERVER_URL, PENDULUM_ENPOINT, REFRESH_PERIOD } from "constants";
import { TextButton, Circle, Pendulum } from "./shapes";

const PIVOT_RADIUS = 4;
const PENDULUM_RADIUS = 20;
const ROD_WIDTH = 2;

export const PendulumsCanvas = ({ width, height, ...canvasProps}) => {
    const [pendulum, setPendulum] = useState(new Pendulum(
        new Circle(width / 2, 0, PIVOT_RADIUS),
        new Circle(width / 2, height / 2, PENDULUM_RADIUS),
        ROD_WIDTH
    ));
    const [startButton] = useState(new TextButton(width / 2, height - 15, "START"));

    const [isDragging, setIsDragging] = useState(false);
    const [isClickingStart, setIsClickingStart] = useState(false);

    const polling = usePolling(SERVER_URL + PENDULUM_ENPOINT, REFRESH_PERIOD, json => {
        setPendulum(Pendulum.fromJson(json));
    });

    ////////////////////
    //                //
    //      Draw      //
    //                //
    ////////////////////

    const draw = useCallback(ctx => {
        pendulum.render(ctx);
        startButton.render(ctx);
    }, [pendulum, startButton]);

    ////////////////////
    //                //
    // Click controls //
    //                //
    ////////////////////

    const onMouseDown = useCallback(e => {
        const { x, y } = getMouseCoords(e);
        setIsDragging(pendulum.bob.contains(x, y));
        setIsClickingStart(startButton.contains(x, y));
    }, [setIsDragging, pendulum, setIsClickingStart, startButton]);

    const onMouseMove = useCallback(e => {
        const delta = getMouseDelta(e);

        if (isDragging) {
            setPendulum(new Pendulum(
                pendulum.pivot,
                new Circle(pendulum.bob.x + delta.x, pendulum.bob.y + delta.y, pendulum.bob.radius),
                ROD_WIDTH
            ));
        }
    }, [pendulum, setPendulum, isDragging]);

    const onMouseUp = useCallback(e => {
        setIsDragging(false);

        const { x, y } = getMouseCoords(e);
        if (isClickingStart && startButton.contains(x, y)) {
            console.log("START!");
            // HttpClient.post(SERVER_URL + PENDULUM_ENPOINT, pendulum.toJson(), polling.start);
        }

        setIsClickingStart(false);
    }, [setIsDragging, isClickingStart, startButton, /*polling, pendulum,*/ setIsClickingStart]);

    ////////////////////
    //                //
    //     Render     //
    //                //
    ////////////////////

    return (
        <Canvas draw={draw} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} width={width} height={height} {...canvasProps} />
    );
};
