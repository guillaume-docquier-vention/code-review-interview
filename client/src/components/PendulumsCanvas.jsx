import React, { useCallback, useEffect, useState } from "react";
import { getMouseCoords, getMouseDelta } from "utils";
import { Canvas } from "components/Canvas";
import { SERVER_URL, PENDULUM_ENDPOINT, REFRESH_PERIOD } from "constants";
import { Circle, Line, Pendulum } from "./shapes";
import { Poller } from "./Poller";
import { SimulationStates } from "./simulation-states";
import { StartButton, PauseButton, StopButton } from "./buttons";

const PIVOT_RADIUS = 6;
const PENDULUM_RADIUS = 20;
const ROD_WIDTH = 4;
const BUTTOM_BOTTOM_MARGIN = 15;

export const PendulumsCanvas = ({ width, height, ...canvasProps}) => {
    const [state, setState] = useState(SimulationStates.STOPPED);
    const [poll, setPoll] = useState(false);

    const [anchor] = useState(new Line(
        new Circle(15, 15),
        new Circle(width - 15, 15),
        4
    ));

    const [pendulums] = useState([1, 2, 3, 4, 5].map(i =>
        ({
            shape: new Pendulum(
                new Circle(i * width / 6, anchor.start.y, PIVOT_RADIUS, { dragAxis: { x: true } }),
                new Circle(i * width / 6, height / 2, PENDULUM_RADIUS),
                ROD_WIDTH
            ),
            server: `${SERVER_URL}:300${i}`,
        })
    ));

    const [startButton] = useState(StartButton(1 * width / 4, height - BUTTOM_BOTTOM_MARGIN, pendulums, setPoll, setState));
    const [pauseButton] = useState(PauseButton(2 * width / 4, height - BUTTOM_BOTTOM_MARGIN, pendulums, setPoll, setState));
    const [stopButton] = useState(StopButton(3 * width / 4, height - BUTTOM_BOTTOM_MARGIN, pendulums, setPoll, setState));

    useEffect(() => {
        if (state === SimulationStates.STARTED) {
            startButton.disabled = true;
            pauseButton.disabled = false;
            stopButton.disabled = false;
        } else if (state === SimulationStates.PAUSED) {
            startButton.disabled = false;
            pauseButton.disabled = true;
            stopButton.disabled = false;
        } else if (state === SimulationStates.STOPPED) {
            startButton.disabled = false;
            pauseButton.disabled = true;
            stopButton.disabled = true;
        }
    }, [state, setState, startButton, pauseButton, stopButton])

    const draw = useCallback(ctx => {
        anchor.render(ctx);
        pendulums.forEach(pendulum => pendulum.shape.render(ctx));
        startButton.render(ctx);
        pauseButton.render(ctx);
        stopButton.render(ctx);
    }, [anchor, pendulums, startButton, pauseButton, stopButton]);

    const mouseDown = useCallback(e => {
        const position = getMouseCoords(e);

        pendulums.forEach(pendulum => pendulum.shape.mouseDown(position));
        startButton.mouseDown(position);
        pauseButton.mouseDown(position);
        stopButton.mouseDown(position);
    }, [pendulums, startButton, pauseButton, stopButton]);

    const mouseMove = useCallback(e => {
        const position = getMouseCoords(e);
        const delta = getMouseDelta(e);

        pendulums.forEach(pendulum => pendulum.shape.mouseMove(position, delta));
        startButton.mouseMove(position, delta);
        pauseButton.mouseMove(position, delta);
        stopButton.mouseMove(position, delta);
    }, [pendulums, startButton, pauseButton, stopButton]);

    const mouseUp = useCallback(e => {
        const position = getMouseCoords(e);

        pendulums.forEach(pendulum => pendulum.shape.mouseUp(position));
        startButton.mouseUp(position);
        pauseButton.mouseUp(position);
        stopButton.mouseUp(position);
    }, [pendulums, startButton, pauseButton, stopButton]);

    return (
        <>
            {pendulums.map(({ shape, server }) => (
                <Poller key={server} shape={shape} url={`${server}/${PENDULUM_ENDPOINT}`} pollingPeriod={REFRESH_PERIOD} poll={poll} />
            ))}
            <Canvas draw={draw} onMouseDown={mouseDown} onMouseMove={mouseMove} onMouseUp={mouseUp} width={width} height={height} {...canvasProps} />
        </>
    );
};
