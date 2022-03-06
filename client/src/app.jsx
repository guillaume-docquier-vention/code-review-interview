import "./app.css";

import React from "react";
import { OscillatingPendulum } from "components/oscillating-pendulum";
import { DraggablePendulum } from "components/draggable-pendulum";

export function App() {
    return (
        <div className="flex flex-column items-center | w-100 h-100">
            <div className="f1 ma3">
                Pendulums
            </div>
            <div className="flex flex-column items-center justify-center">
                <div className="ma1 | bg-light-grey">
                    <div className="f3 ml2 mt1">Draggable</div>
                    <DraggablePendulum width={1000} height={750} />
                </div>
                <div className="ma1 | bg-light-grey">
                    <div className="f3 ml2 mt1">Oscillating</div>
                    <OscillatingPendulum width={1000} height={750} />  
                </div>
            </div>
        </div>
    );
};
