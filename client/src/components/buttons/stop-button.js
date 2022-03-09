import { TextButton } from "components/shapes";
import { SimulationStates } from "components/simulation-states";
import { STOP_ENDPOINT } from "constants";
import { HttpClient } from "utils";

export const StopButton = (x, y, pendulums, setPoll, setState) => {
    return new TextButton(x, y, "STOP", {
        onClick: async () => {
            setPoll(false);
            for (const pendulum of pendulums) {
                const response = await HttpClient.post(`${pendulum.server}/${STOP_ENDPOINT}`, pendulum.shape.toJson())
                if (response.status === 200) {
                    const json = await response.json();
                    pendulum.shape.bob.x = json.bobPosition.x;
                    pendulum.shape.bob.y = json.bobPosition.y;
                }
            }

            setState(SimulationStates.STOPPED);
        },
        backgroundColor: "green",
        textColor: "darkblue",
        disabled: true
    });
};
