import "./app.css";

import React from "react";
import { PendulumsCanvas } from "components/PendulumsCanvas";

export function App() {
    return (
        <div className="flex flex-column items-center | w-100 h-100">
            <div className="f1 ma3">
                Pendulums
            </div>
            <div className="flex flex-column items-center justify-center | user-select-none">
                <div className="ma1 | bg-light-grey">
                    <PendulumsCanvas width={1000} height={750} />
                </div>
            </div>
        </div>
    );
};
