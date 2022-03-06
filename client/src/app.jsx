import "./app.css";

import React, { useCallback } from "react";
import { degreesToRadians } from "./utils";
import { Canvas } from "./components/canvas";

export function App() {
    const draw = useCallback((ctx, frameCount) => {
        ctx.fillStyle = "darkred";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;

        const center = {
            x: ctx.canvas.width / 2,
            y: ctx.canvas.height / 2,
        };
        const radius = 20;
        const x = center.x + 100 * Math.sin(frameCount * 0.01);
        const y = center.y + 100 * Math.cos(frameCount * 0.01)**2;

        ctx.beginPath();
        ctx.moveTo(center.x, 0);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(x, y, radius, degreesToRadians(0), degreesToRadians(360));
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }, []);

    return (
        <div className="flex flex-column items-center | w-100 h-100">
            <div className="f1 ma3">
                Pendulums
            </div>
            <div className="flex items-center justify-center | bg-light-grey">
                <Canvas className="drawing-zone" draw={draw} width={1000} height={750} />
            </div>
        </div>
    );
};
