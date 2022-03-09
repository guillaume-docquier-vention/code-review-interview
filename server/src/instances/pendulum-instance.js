import { StatusCodes } from "http-status-codes";

import { Pendulum } from "./pendulum";
import { Instance } from "./instance";
import { SimulationStates } from "./simulation-states";
import { MS_PER_SECONDS, NO_WIND, EARTH_GRAVITY } from "../constants";

export class PendulumInstance extends Instance {
    constructor(port, clientUrl) {
        super(port, clientUrl);

        this.tickPeriod = MS_PER_SECONDS / 60;

        this.simulationState = SimulationStates.STOPPED;
        this.pendulum = null;
        this.simulationInterval = null;
    }

    setupRoutes(app) {
        app.get("/pendulum", (req, res) => {
            if (!this.pendulum) {
                return res.sendStatus(StatusCodes.PRECONDITION_REQUIRED);
            }

            return res.json(this.pendulum.toJson());
        });

        app.post("/start", (req, res) => {
            if (this.simulationState === SimulationStates.STOPPED) {
                this.pendulum = new Pendulum(
                    req.body.pivotPosition,
                    req.body.bobPosition,
                    req.body.angle,
                    req.body.mass,
                    req.body.bobRadius,
                    NO_WIND,
                    EARTH_GRAVITY,
                );
            }

            this.simulationState = SimulationStates.STARTED;
            clearInterval(this.simulationInterval);
            this.simulationInterval = setInterval(() => this.pendulum.tick(this.tickPeriod), this.tickPeriod);

            console.log(`[${new Date().toISOString()}] Simulation started on ${this.port}`);
            return res.sendStatus(StatusCodes.CREATED);
        });

        app.post("/pause", (req, res) => {
            if (this.simulationState !== SimulationStates.STARTED) {
                return res.sendStatus(StatusCodes.PRECONDITION_REQUIRED);
            }

            this.simulationState = SimulationStates.PAUSED;
            clearInterval(this.simulationInterval);

            console.log(`[${new Date().toISOString()}] Simulation paused on ${this.port}`);
            return res.sendStatus(StatusCodes.OK);
        });

        app.post("/stop", (req, res) => {
            this.simulationState = SimulationStates.STOPPED;
            clearInterval(this.simulationInterval);
            this.pendulum.reset();

            console.log(`[${new Date().toISOString()}] Simulation stopped on ${this.port}`);
            return res.json(this.pendulum.toJson());
        });
    }
}
