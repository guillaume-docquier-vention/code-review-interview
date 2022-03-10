import { TextButton } from "components/shapes";
import { SimulationStates } from "components/simulation-states";
import { PAUSE_ENDPOINT } from "constants";
import { HttpClient } from "utils";

export const PauseButton = (x, y, pendulums, setState) => {
    return new TextButton(x, y, "PAUSE", {
        onClick: async () => {
            for (const pendulum of pendulums) {
                await HttpClient.post(`${pendulum.server}/${PAUSE_ENDPOINT}`, pendulum.shape.toJson())
            }
            setState(SimulationStates.PAUSED);
        },
        backgroundColor: "green",
        textColor: "darkblue",
        disabled: true
    });
}