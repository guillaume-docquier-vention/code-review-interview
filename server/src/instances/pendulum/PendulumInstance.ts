import { StatusCodes } from "http-status-codes";

import { Instance } from "../instance";
import { MS_PER_SECONDS } from "../../constants";
import { PendulumSimulation } from "./PendulumSimulation";
import type { Express, Request, Response } from 'express'
import type { PendulumJson } from './PendulumJson'

const PAUSE_AFTER_COLLISION = 5_000;

export class PendulumInstance extends Instance {
    private restartMessages: Record<string, boolean> | null
    private readonly simulation: PendulumSimulation

    constructor(port: number, clientUrl: string) {
        super(port, clientUrl);

        this.restartMessages = null;
        this.simulation = new PendulumSimulation(
            MS_PER_SECONDS / 30,
            this.getOtherPendulums.bind(this),
            this.onCollision.bind(this),
        );
    }

    protected override setupRoutes(app: Express): void {
        app.get("/pendulum", this.getPendulum.bind(this));
        app.post("/start", this.startSimulation.bind(this));
        app.post("/pause", this.pauseSimulation.bind(this));
        app.post("/reset", this.resetSimulation.bind(this));

        app.post("/collision", this.handleCollision.bind(this));
        app.post("/restart", this.handleRestartSequence.bind(this));
    }

    private getPendulum(req: Request, res: Response): void {
        const { state } = this.simulation;
        if (!state) {
            res.sendStatus(StatusCodes.PRECONDITION_REQUIRED);
            return
        }

        res.json(state);
        return
    }

    private startSimulation(req: Request, res: Response): void {
        this.simulation.start(req.body);

        console.log(`[${new Date().toISOString()}] Simulation started on ${this.port}`);
        res.sendStatus(StatusCodes.CREATED);
    }

    private pauseSimulation(req: Request, res: Response): void {
        this.simulation.pause();

        console.log(`[${new Date().toISOString()}] Simulation paused on ${this.port}`);
        res.sendStatus(StatusCodes.OK);
    }

    private resetSimulation(req: Request, res: Response): void {
        this.simulation.reset();

        console.log(`[${new Date().toISOString()}] Simulation reset on ${this.port}`);
        res.json(this.simulation.state);
    }

    private handleCollision() {
        this.simulation.initRestart();
        if (this.restartMessages === null) {
            this.restartMessages = this.getRestartMessages();
            setTimeout(() => {
                this.neighborUrls.forEach(neighborUrl => fetch(`${neighborUrl}/restart`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id: this.url })
                }))
            }, PAUSE_AFTER_COLLISION);

            console.log(`[${new Date().toISOString()}] Collision reported on ${this.port}`);
        }
    }

    private handleRestartSequence(req: Request): void {
        this.restartMessages![req.body.id] = true;
        if (Object.values(this.restartMessages!).every(isTrue => isTrue)) {
            this.simulation.restart();
            this.restartMessages = null;

            console.log(`[${new Date().toISOString()}] Simulation restarted on ${this.port}`);
        }
    }

    private async getOtherPendulums(): Promise<PendulumJson[]> {
        const pendulumRequests = this.neighborUrls
          .map(neighborUrl => fetch(`${neighborUrl}/pendulum`).then(response => response.json()).catch(() => null)) as Promise<PendulumJson | null>[];
        const pendulums = await Promise.all(pendulumRequests);

        return pendulums.filter(p => p !== null);
    }

    private onCollision(): void {
        this.neighborUrls.forEach(neighborUrl => fetch(`${neighborUrl}/collision`, { method: "POST" }));
        this.handleCollision();
    }

    private getRestartMessages(): Record<string, false> {
        return this.neighborUrls.reduce((messages, neighborUrl) => {
            messages[neighborUrl] = false;

            return messages;
        }, {} as Record<string, false>);
    }
}
