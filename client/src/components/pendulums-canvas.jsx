import React, { useCallback, useState } from "react";
import { degreesToRadians, getMouseCoords, getMouseDelta, HttpClient } from "utils";
import { Canvas } from "components/canvas";
import { usePolling } from "hooks";
import { SERVER_URL, PENDULUM_ENPOINT, REFRESH_PERIOD } from "constants";
import { Circle, Pendulum, Rectangle } from "./shapes";

const PIVOT_RADIUS = 4;
const PENDULUM_RADIUS = 20;
const ROD_WIDTH = 2;
const DEFAULT_LINE_WIDTH = 2;

export const PendulumsCanvas = ({ width, height, ...canvasProps}) => {
    const [pendulum, setPendulum] = useState(new Pendulum(
        new Circle(width / 2, 0, PIVOT_RADIUS),
        new Circle(width / 2, height / 2, PENDULUM_RADIUS),
        ROD_WIDTH
    ));
    const [startButton, setStartButton] = useState(null);
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
        ctx.fillStyle = "darkred";
        ctx.strokeStyle = "black";

        const center = {
            x: ctx.canvas.width / 2,
            y: ctx.canvas.height / 2,
        };

        // Rod
        ctx.beginPath();
        ctx.lineWidth = pendulum.rod.width;
        ctx.moveTo(pendulum.rod.start.x, pendulum.rod.start.y);
        ctx.lineTo(pendulum.rod.end.x, pendulum.rod.end.y);
        ctx.stroke();
        ctx.closePath();

        // Pivot
        ctx.beginPath();
        ctx.lineWidth = DEFAULT_LINE_WIDTH;
        ctx.arc(pendulum.pivot.x, pendulum.pivot.y, pendulum.pivot.radius, degreesToRadians(0), degreesToRadians(360));
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // Bob
        ctx.beginPath();
        ctx.lineWidth = DEFAULT_LINE_WIDTH;
        ctx.arc(pendulum.bob.x, pendulum.bob.y, pendulum.bob.radius, degreesToRadians(0), degreesToRadians(360));
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        // Start button
        ctx.beginPath();
        ctx.textAlign = "center";
        ctx.font = "bold 50px sans-serif";

        const text = {
            text: "START",
            x: center.x,
            y: ctx.canvas.height - 15
        }
        const textMetrics = ctx.measureText(text.text);

        const padding = 10;
        const startBtn = new Rectangle(
            text.x - textMetrics.actualBoundingBoxLeft - padding,
            text.y - textMetrics.actualBoundingBoxAscent - padding,
            textMetrics.width + 2 * padding,
            textMetrics.actualBoundingBoxAscent + 2 * padding,
        );
        ctx.fillStyle = "blue";
        ctx.fillRect(startBtn.x, startBtn.y, startBtn.width, startBtn.height);
        if (!startButton) {
            setStartButton(startBtn);
        }

        ctx.fillStyle = "darkred";
        ctx.fillText(text.text, text.x, text.y);
        ctx.closePath();
    }, [pendulum, startButton, setStartButton]);

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
