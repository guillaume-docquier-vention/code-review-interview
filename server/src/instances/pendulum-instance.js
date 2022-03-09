import { StatusCodes } from "http-status-codes";

import { Pendulum } from "./pendulum";
import { Instance } from "./instance";
import { SimulationStates } from "./simulation-states";
import { MS_PER_SECONDS, NO_WIND, EARTH_GRAVITY } from "../constants";

export class PendulumInstance extends Instance {
    constructor(port, clientUrl) {
        super(port, clientUrl);

        this.tickPeriod = MS_PER_SECONDS / 60;

        this.simulationState = SimulationStates.NOT_STARTED;
        this.pendulum = null;
        this.simulationInterval = null;
    }

    setupRoutes(app) {
        app.get("/pendulum", (req, res) => {
            if (this.pendulum) {
                return res.json(this.pendulum.toJson());
            }

            return res.sendStatus(StatusCodes.PRECONDITION_REQUIRED);
        });

        app.post("/pendulum", (req, res) => {
            this.pendulum = new Pendulum(
                req.body.pivotPosition,
                req.body.bobPosition,
                req.body.angle,
                req.body.mass,
                req.body.bobRadius,
                NO_WIND,
                EARTH_GRAVITY,
            );

            this.simulationState = SimulationStates.STARTED;
            clearInterval(this.simulationInterval);
            this.simulationInterval = setInterval(() => this.pendulum.tick(this.tickPeriod), this.tickPeriod);

            console.log(`[${new Date().toISOString()}] Simulation started on ${this.port}`);
            return res.sendStatus(StatusCodes.CREATED);
        });
    }
}
