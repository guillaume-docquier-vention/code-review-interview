import React, { useEffect, useRef } from "react";
import { useCallback } from "react";

export const Canvas = ({ draw, ...canvasProps }) => {
    const canvasRef = useRef(null);

    const addCenterMark = useCallback(ctx => {
        ctx.strokeStyle = "greenyellow";
        ctx.lineWidth = 3;

        const center = {
            x: ctx.canvas.width / 2,
            y: ctx.canvas.height / 2,
        };

        const crossRadius = 15 / 2;

        ctx.beginPath();
        ctx.moveTo(center.x - crossRadius, center.y);
        ctx.lineTo(center.x + crossRadius, center.y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.moveTo(center.x, center.y - crossRadius);
        ctx.lineTo(center.x, center.y + crossRadius);
        ctx.stroke();
        ctx.closePath();
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        const context = canvas.getContext("2d");

        let frameCount = 0;
        let animationFrameId;

        const render = () => {
            frameCount++;
            context.clearRect(0, 0, context.canvas.width, context.canvas.height);
            addCenterMark(context);
            draw(context, frameCount);
            animationFrameId = window.requestAnimationFrame(render);
        }

        render();

        return () => {
            window.cancelAnimationFrame(animationFrameId);
        }
    }, [draw, addCenterMark]);

    return (
        <canvas ref={canvasRef} {...canvasProps}/>
    );
};
