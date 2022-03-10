import { TextButton } from "components/shapes";
import { SimulationStates } from "components/simulation-states";
import { RESET_ENDPOINT } from "constants";
import { HttpClient } from "utils";

export const ResetButton = (x, y, pendulums, setState) => {
    return new TextButton(x, y, "RESET", {
        onClick: async () => {
            for (const pendulum of pendulums) {
                const response = await HttpClient.post(`${pendulum.server}/${RESET_ENDPOINT}`, pendulum.shape.toJson())
                if (response.status === 200) {
                    const json = await response.json();
                    pendulum.shape.bob.x = json.bobPosition.x;
                    pendulum.shape.bob.y = json.bobPosition.y;
                }
            }

            setState(SimulationStates.STOPPED);
        },
        disabled: true
    });
};
