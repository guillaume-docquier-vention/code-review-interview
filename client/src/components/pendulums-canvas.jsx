import React, { useCallback, useEffect, useState } from "react";
import { getMouseCoords, getMouseDelta, HttpClient } from "utils";
import { Canvas } from "components/canvas";
import { SERVER_URL, PENDULUM_ENDPOINT, START_ENDPOINT, PAUSE_ENDPOINT, STOP_ENDPOINT, REFRESH_PERIOD } from "constants";
import { TextButton, Circle, Pendulum } from "./shapes";
import { Poller } from "./poller";

const PIVOT_RADIUS = 6;
const PENDULUM_RADIUS = 20;
const ROD_WIDTH = 4;

export const SimulationStates = {
    STARTED: "started",
    PAUSED: "paused",
    STOPPED: "stopped",
};

export const PendulumsCanvas = ({ width, height, ...canvasProps}) => {
    const [state, setState] = useState(SimulationStates.STOPPED);
    const [poll, setPoll] = useState(false);
    const [pendulums] = useState([1, 2, 3, 4, 5].map(i =>
        ({
            shape: new Pendulum(
                new Circle(i * width / 6, 0, PIVOT_RADIUS, { dragAxis: { x: true } }),
                new Circle(i * width / 6, height / 2, PENDULUM_RADIUS),
                ROD_WIDTH
            ),
            server: `${SERVER_URL}:300${i}`,
        })
    ));

    const [startButton] = useState(new TextButton(1 * width / 4, height - 15, "START", {
        onClick: async () => {
            for (const pendulum of pendulums) {
                await HttpClient.post(`${pendulum.server}/${START_ENDPOINT}`, pendulum.shape.toJson())
            }

            setPoll(true);
            setState(SimulationStates.STARTED);
        },
        backgroundColor: "green",
        textColor: "darkblue",
        disabled: false
    }));

    const [pauseButton] = useState(new TextButton(2 * width / 4, height - 15, "PAUSE", {
        onClick: async () => {
            setPoll(false);
            for (const pendulum of pendulums) {
                await HttpClient.post(`${pendulum.server}/${PAUSE_ENDPOINT}`, pendulum.shape.toJson())
            }
            setState(SimulationStates.PAUSED);
        },
        backgroundColor: "green",
        textColor: "darkblue",
        disabled: true
    }));

    const [stopButton] = useState(new TextButton(3 * width / 4, height - 15, "STOP", {
        onClick: async () => {
            setPoll(false);
            for (const pendulum of pendulums) {
                const response = await HttpClient.post(`${pendulum.server}/${STOP_ENDPOINT}`, pendulum.shape.toJson())
                if (response.status === 200) {
                    const json = await response.json();
                    pendulum.shape.bob.x = json.bobPosition.x;
                    pendulum.shape.bob.y = json.bobPosition.y;
                }
            }

            setState(SimulationStates.STOPPED);
        },
        backgroundColor: "green",
        textColor: "darkblue",
        disabled: true
    }));

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
        pendulums.forEach(pendulum => pendulum.shape.render(ctx));
        startButton.render(ctx);
        pauseButton.render(ctx);
        stopButton.render(ctx);
    }, [pendulums, startButton, pauseButton, stopButton]);


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
