import React, { useCallback, useState } from "react";
import { degreesToRadians, getMouseCoords, getMouseDelta, HttpClient } from "utils";
import { Canvas } from "components/canvas";
import { usePolling } from "hooks";
import { SERVER_URL, PENDULUM_ENPOINT, REFRESH_PERIOD } from "constants";

class Rectangle {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    contains(x, y) {
        return x >= this.x &&
            x <= this.x + this.width &&
            y >= this.y &&
            y <= this.y + this.height;
    }
}

class Pendulum {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.stringLength = 1;
        this.angularOffset = 2;
        this.mass = 3;
        this.radius = radius;
        this.wind = 4;
    }

    static fromJson(json) {
        return new Pendulum(
            json.x,
            json.y,
            json.radius
        );
    }

    toJson() {
        return {
            x: this.x,
            y: this.y,
            stringLength: this.stringLength,
            angularOffset: this.angularOffset,
            mass: this.mass,
            radius: this.radius,
            wind: this.wind,
        };
    }

    getOffset(x, y) {
        return {
            x: x - this.x,
            y: y - this.y
        }
    }

    contains(x, y) {
        const offset = this.getOffset(x, y);

        return Math.sqrt(offset.x**2 + offset.y**2) <= this.radius;
    }
}

export const DraggablePendulum = ({ width, height, ...canvasProps}) => {
    const [pendulum, setPendulum] = useState(new Pendulum(width / 2, height / 2, 20));
    const [startButton, setStartButton] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isClickingStart, setIsClickingStart] = useState(false);
    const polling = usePolling(SERVER_URL + PENDULUM_ENPOINT, REFRESH_PERIOD, json => {
        setPendulum(Pendulum.fromJson(json));
    });

    const draw = useCallback(ctx => {
        ctx.fillStyle = "darkred";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        const center = {
            x: ctx.canvas.width / 2,
            y: ctx.canvas.height / 2,
        };

        ctx.beginPath();
        ctx.moveTo(center.x, 0);
        ctx.lineTo(pendulum.x, pendulum.y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(pendulum.x, pendulum.y, pendulum.radius, degreesToRadians(0), degreesToRadians(360));
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

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

    const onMouseDown = useCallback(e => {
        const { x, y } = getMouseCoords(e);
        setIsDragging(pendulum.contains(x, y));
        setIsClickingStart(startButton.contains(x, y));
    }, [setIsDragging, pendulum, setIsClickingStart, startButton]);

    const onMouseMove = useCallback(e => {
        const delta = getMouseDelta(e);

        if (isDragging) {
            setPendulum(new Pendulum(
                pendulum.x + delta.x,
                pendulum.y + delta.y,
                pendulum.radius
            ));
        }
    }, [pendulum, setPendulum, isDragging]);

    const onMouseUp = useCallback(e => {
        setIsDragging(false);

        const { x, y } = getMouseCoords(e);
        if (isClickingStart && startButton.contains(x, y)) {
            HttpClient.post(SERVER_URL + PENDULUM_ENPOINT, pendulum.toJson(), polling.start);
        }

        setIsClickingStart(false);
    }, [setIsDragging, isClickingStart, startButton, polling, pendulum, setIsClickingStart]);

    return (
        <Canvas draw={draw} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} width={width} height={height} {...canvasProps} />
    );
};
