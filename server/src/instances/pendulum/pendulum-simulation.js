import { EARTH_GRAVITY } from "../../constants";
import { Pendulum } from "./pendulum";

export const Statuses = {
    STARTED: "started",
    PAUSED: "paused",
    STOPPED: "stopped",
    RESTARTING: "restarting",
};

export class PendulumSimulation {
    constructor(tickPeriod, getOtherPendulums, onCollision) {
        this.tickPeriod = tickPeriod;
        this.getOtherPendulums = getOtherPendulums;
        this.onCollision = onCollision;

        this.status = Statuses.STOPPED;
        this.pendulum = null;
        this.simulationInterval = null;
    }

    get state() {
        return {
            ...this.pendulum?.toJson(),
            status: this.status,
        };
    }

    start(pendulumJson) {
        if (this.status === Statuses.STOPPED) {
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

        this.status = Statuses.STARTED;
        clearInterval(this.simulationInterval);
        this.simulationInterval = setInterval(() => this.tick(this.tickPeriod), this.tickPeriod);
    }

    pause() {
        this.status = Statuses.PAUSED;
        clearInterval(this.simulationInterval);
    }

    reset() {
        this.status = Statuses.STOPPED;
        clearInterval(this.simulationInterval);
        this.pendulum.reset();
    }

    initRestart() {
        this.pause();
        this.status = Statuses.RESTARTING;
    }

    restart() {
        if (this.status === Statuses.RESTARTING) {
            this.reset();
        }
    }

    async tick(tickPeriod) {
        this.pendulum.tick(tickPeriod);

        const pendulums = await this.getOtherPendulums();
        if (pendulums.some(pendulum => this.pendulum.detectCollision(pendulum))) {
            return this.onCollision();
        }

        return null;
    }
}
