// eslint-disable-next-line import/no-unresolved
import got from "got";
import { StatusCodes } from "http-status-codes";

import { Instance } from "../instance";
import { MS_PER_SECONDS } from "../../constants";
import { PendulumSimulation } from "./pendulum-simulation";

export class PendulumInstance extends Instance {
    constructor(port, clientUrl) {
        super(port, clientUrl);

        this.simulation = new PendulumSimulation(
            MS_PER_SECONDS / 30,
            this.getOtherPendulums.bind(this),
            this.onCollision.bind(this),
        );
    }

    setupRoutes(app) {
        app.get("/pendulum", this.getPendulum.bind(this));
        app.post("/start", this.startSimulation.bind(this));
        app.post("/pause", this.pauseSimulation.bind(this));
        app.post("/reset", this.resetSimulation.bind(this));
    }

    getPendulum(req, res) {
        const { state } = this.simulation;
        if (!state) {
            return res.sendStatus(StatusCodes.PRECONDITION_REQUIRED);
        }

        return res.json(state);
    }

    startSimulation(req, res) {
        this.simulation.start(req.body, this.neighborUrls);

        // eslint-disable-next-line no-console
        console.log(`[${new Date().toISOString()}] Simulation started on ${this.port}`);
        return res.sendStatus(StatusCodes.CREATED);
    }

    pauseSimulation(req, res) {
        if (!this.simulation.pause()) {
            return res.sendStatus(StatusCodes.PRECONDITION_REQUIRED);
        }

        // eslint-disable-next-line no-console
        console.log(`[${new Date().toISOString()}] Simulation paused on ${this.port}`);
        return res.sendStatus(StatusCodes.OK);
    }

    resetSimulation(req, res) {
        if (!this.simulation.reset()) {
            return res.sendStatus(StatusCodes.PRECONDITION_REQUIRED);
        }

        // eslint-disable-next-line no-console
        console.log(`[${new Date().toISOString()}] Simulation reset on ${this.port}`);
        return res.json(this.simulation.state);
    }

    async getOtherPendulums() {
        const pendulumRequests = this.neighborUrls.map(neighborUrl => got.get(`${neighborUrl}/pendulum`).json().catch(() => null));
        const pendulums = await Promise.all(pendulumRequests);

        return pendulums.filter(p => p);
    }

    onCollision() {
        this.neighborUrls.forEach(neighborUrl => got.post(`${neighborUrl}/reset`).catch(() => null));
        this.simulation.reset();
    }
}
