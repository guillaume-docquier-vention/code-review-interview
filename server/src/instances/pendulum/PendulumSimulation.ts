import { EARTH_GRAVITY } from "../../constants";
import { Pendulum } from "./Pendulum";
import type { PendulumJson } from './PendulumJson'

enum Status {
    STARTED = "started",
    PAUSED = "paused",
    STOPPED = "stopped",
    RESTARTING = "restarting",
}

type PendulumSimulationState = PendulumJson & { status: Status }

export class PendulumSimulation {
    private readonly tickPeriod: number
    private readonly getOtherPendulums: () => Promise<PendulumJson[]>
    private readonly onCollision: () => void
    private status: Status
    private pendulum: Pendulum | null
    private simulationInterval: NodeJS.Timeout | undefined

    public constructor(tickPeriod: number, getOtherPendulums: () => Promise<PendulumJson[]>, onCollision: () => void) {
        this.tickPeriod = tickPeriod;
        this.getOtherPendulums = getOtherPendulums;
        this.onCollision = onCollision;

        this.status = Status.STOPPED;
        this.pendulum = null;
    }

    public get state(): PendulumSimulationState {
        return {
            ...this.pendulum!.toJson(),
            status: this.status,
        };
    }

    public start(pendulumJson: PendulumJson): void {
        if (this.status === Status.STOPPED) {
            this.pendulum = new Pendulum(
                pendulumJson.pivotPosition,
                pendulumJson.bobPosition,
                pendulumJson.angle,
                pendulumJson.mass,
                pendulumJson.bobRadius,
                pendulumJson.wind,
                EARTH_GRAVITY,
            );
        }

        this.status = Status.STARTED;
        clearInterval(this.simulationInterval);
        this.simulationInterval = setInterval(() => this.tick(this.tickPeriod), this.tickPeriod);
    }

    public pause() {
        this.status = Status.PAUSED;
        clearInterval(this.simulationInterval);
    }

    public reset() {
        this.status = Status.STOPPED;
        clearInterval(this.simulationInterval);
        this.pendulum?.reset();
    }

    public initRestart() {
        this.pause();
        this.status = Status.RESTARTING;
    }

    public restart(): void {
        if (this.status === Status.RESTARTING) {
            this.reset();
        }
    }

    private async tick(tickPeriod: number): Promise<void | null> {
        this.pendulum?.tick(tickPeriod);

        const pendulums = await this.getOtherPendulums();
        if (pendulums.some(pendulum => this.pendulum?.detectCollision(pendulum))) {
            return this.onCollision();
        }

        return null;
    }
}
