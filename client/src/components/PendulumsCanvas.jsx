import React, { useCallback, useEffect, useState } from "react";
import { getMouseCoords, getMouseDelta } from "utils";
import { Canvas } from "components/Canvas";
import { SERVER_URL, PENDULUM_ENDPOINT, REFRESH_PERIOD } from "constants";
import { Circle, Line, Pendulum } from "./shapes";
import { Poller } from "./Poller";
import { SimulationStates } from "./simulation-states";
import { StartButton, PauseButton, ResetButton, WindCompass } from "./controls";

const PIVOT_RADIUS = 6;
const PENDULUM_RADIUS = 20;
const ROD_WIDTH = 4;
const BUTTOM_BOTTOM_MARGIN = 15;
const PENDULUM_COUNT = 5;
const PENDULUM_INDEXES = Array.from({ length: PENDULUM_COUNT }, (_, i) => i + 1);

export const PendulumsCanvas = ({ width, height, ...canvasProps}) => {
    const [state, setState] = useState(SimulationStates.STOPPED);
    const [interactionsEnabed, setInteractionsEnabed] = useState(true);
    const [poll, setPoll] = useState(false);

    const [anchor] = useState(new Line(
        new Circle(15, 15),
        new Circle(width - 15, 15),
        4
    ));

    const [pendulums] = useState(PENDULUM_INDEXES.map(i =>
        ({
            shape: new Pendulum(
                new Circle(i * width / 6, anchor.start.y, PIVOT_RADIUS, { dragAxis: { x: true } }),
                new Circle(i * width / 6, height / 2, PENDULUM_RADIUS + 10 * (i - 1)),
                ROD_WIDTH
            ),
            server: `${SERVER_URL}:300${i}`,
        })
    ));

    const [startButton] = useState(StartButton(1 * width / 4.5, height - BUTTOM_BOTTOM_MARGIN, pendulums, setState));
    const [pauseButton] = useState(PauseButton(2 * width / 4.5, height - BUTTOM_BOTTOM_MARGIN, pendulums, setState));
    const [resetButton] = useState(ResetButton(3 * width / 4.5, height - BUTTOM_BOTTOM_MARGIN, pendulums, setState));
    const [windCompass] = useState(WindCompass(width - 75, height - 75, pendulums));

    useEffect(() => {
        setInteractionsEnabed(state === SimulationStates.STOPPED);
    }, [state, setInteractionsEnabed]);

    useEffect(() => {
        setPoll(state !== SimulationStates.STOPPED);
    }, [state, setPoll]);

    useEffect(() => {
        startButton.disabled = [SimulationStates.STARTED, SimulationStates.RESTARTING].includes(state);
        pauseButton.disabled = state !== SimulationStates.STARTED;
        resetButton.disabled = state === SimulationStates.STOPPED;
    }, [state, setState, startButton, pauseButton, resetButton])

    const draw = useCallback(ctx => {
        anchor.render(ctx);
        pendulums.forEach(pendulum => pendulum.shape.render(ctx));
        startButton.render(ctx);
        pauseButton.render(ctx);
        resetButton.render(ctx);
        windCompass.render(ctx);
    }, [anchor, pendulums, startButton, pauseButton, resetButton, windCompass]);

    const mouseDown = useCallback(e => {
        const position = getMouseCoords(e);

        if (interactionsEnabed) {
            pendulums.forEach(pendulum => pendulum.shape.mouseDown(position));
            windCompass.mouseDown(position);
        }

        startButton.mouseDown(position);
        pauseButton.mouseDown(position);
        resetButton.mouseDown(position);

    }, [interactionsEnabed, pendulums, startButton, pauseButton, resetButton, windCompass]);

    const mouseMove = useCallback(e => {
        const position = getMouseCoords(e);
        const delta = getMouseDelta(e);

        if (interactionsEnabed) {
            pendulums.forEach(pendulum => pendulum.shape.mouseMove(position, delta));
            windCompass.mouseMove(position, delta);
        }

        startButton.mouseMove(position, delta);
        pauseButton.mouseMove(position, delta);
        resetButton.mouseMove(position, delta);
    }, [interactionsEnabed, pendulums, startButton, pauseButton, resetButton, windCompass]);

    const mouseUp = useCallback(e => {
        const position = getMouseCoords(e);

        if (interactionsEnabed) {
            pendulums.forEach(pendulum => pendulum.shape.mouseUp(position));
            windCompass.mouseUp(position);
        }

        startButton.mouseUp(position);
        pauseButton.mouseUp(position);
        resetButton.mouseUp(position);
    }, [interactionsEnabed, pendulums, startButton, pauseButton, resetButton, windCompass]);

    return (
        <>
            {pendulums.map(({ shape, server }) => (
                <Poller
                    key={server}
                    shape={shape}
                    url={`${server}/${PENDULUM_ENDPOINT}`}
                    pollingPeriod={REFRESH_PERIOD}
                    poll={poll}
                    onPoll={json => {
                        shape.bob.x = json.bobPosition.x;
                        shape.bob.y = json.bobPosition.y;
                        setState(json.status);
                    }}
                />
            ))}
            <Canvas draw={draw} onMouseDown={mouseDown} onMouseMove={mouseMove} onMouseUp={mouseUp} width={width} height={height} {...canvasProps} />
        </>
    );
};
