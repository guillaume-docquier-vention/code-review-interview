import React, { useCallback, useState } from "react";
import { degreesToRadians, getMouseCoords, getMouseDelta } from "utils";
import { Canvas } from "components/canvas";
import { usePolling } from "hooks";
import { SERVER_URL, PENDULUM_ENPOINT, REFRESH_PERIOD } from "constants";

class Pendulum {
    constructor(x, y, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
    }

    static fromJson(json) {
        return new Pendulum(
            json.x,
            json.y,
            json.radius
        );
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
    const [isDragging, setIsDragging] = useState(false);
    usePolling(SERVER_URL + PENDULUM_ENPOINT, REFRESH_PERIOD, json => {
        console.log("tick", json);
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
    }, [pendulum]);

    const onMouseDown = useCallback(e => {
        const { x, y } = getMouseCoords(e);
        setIsDragging(pendulum.contains(x, y));
    }, [pendulum, setIsDragging]);

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
    }, [setIsDragging]);

    return (
        <Canvas draw={draw} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} width={width} height={height} {...canvasProps} />
    );
};
