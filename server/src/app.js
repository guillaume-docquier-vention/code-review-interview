const express = require('express');
const cors = require('cors')
const { StatusCodes } = require('http-status-codes');

const app = express();
app.use(express.json());
app.use(cors());

const port = 3001;
const tickPeriod = 1000 / 60;

class Pendulum {
    constructor(x, y, stringLength, angularOffset, mass, radius, wind) {
        this.initialState = {
            x: x,
            y: y,
            stringLength: stringLength,
            angularOffset: angularOffset,
            mass: mass,
            radius: radius,
            wind: wind,
            speed: 1,
            acceleration: 0,
        }

        this.reset();
    }

    tick() {
        const amplitude = 100;
        if (this.x <= this.initialState.x - amplitude || this.x >= this.initialState.x + amplitude) {
            this.speed *= -1;
        }

        this.x += this.speed;
    }

    reset() {
        this.x = this.initialState.x;
        this.y = this.initialState.y;
        this.stringLength = this.initialState.stringLength;
        this.angularOffset = this.initialState.angularOffset;
        this.mass = this.initialState.mass;
        this.radius = this.initialState.radius;
        this.wind = this.initialState.wind;
        this.speed = this.initialState.speed;
        this.acceleration = this.initialState.acceleration;
    }

    toJson() {
        return {
            x: this.x,
            y: this.y,
            stringLength: this.stringLength,
            angularOffset: this.angularOffset,
            mass: this.mass,
            radius: this.radius,
            wind: this.wind,
        };
    }
}

const SimulationStates = {
    NOT_STARTED: "notStarted",
    STARTED: "started",
    PAUSED: "paused",
    STOPPED: "stopped"
}

let simulationState = SimulationStates.NOT_STARTED;
let pendulum = null;
let simulationInterval = null;

app.get('/pendulum', (req, res) => {
    if (pendulum) {
        return res.json(pendulum.toJson());
    }

    return res.sendStatus(StatusCodes.PRECONDITION_REQUIRED);
});

app.post('/pendulum', (req, res) => {
    pendulum = new Pendulum(
        req.body.x,
        req.body.y,
        req.body.stringLength,
        req.body.angularOffset,
        req.body.mass,
        req.body.radius,
        req.body.wind,
    );

    simulationState = SimulationStates.STARTED;
    clearInterval(simulationInterval);
    simulationInterval = setInterval(() => pendulum.tick(), tickPeriod);

    return res.sendStatus(StatusCodes.CREATED);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
