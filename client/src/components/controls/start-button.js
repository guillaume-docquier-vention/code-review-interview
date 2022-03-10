import { TextButton } from "components/shapes";
import { SimulationStates } from "components/simulation-states";
import { START_ENDPOINT } from "constants";
import { HttpClient } from "utils";

export const StartButton = (x, y, pendulums, setState) => {
    return new TextButton(x, y, "START", {
        onClick: async () => {
            for (const pendulum of pendulums) {
                await HttpClient.post(`${pendulum.server}/${START_ENDPOINT}`, pendulum.shape.toJson())
            }

            setState(SimulationStates.STARTED);
        },
        disabled: false
    });
};
