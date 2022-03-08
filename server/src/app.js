const express = require("express");
const cors = require("cors");
const { StatusCodes } = require("http-status-codes");

const { CLIENT_URL, EARTH_GRAVITY, NO_WIND } = require("./constants");
const { Pendulum } = require("./pendulum");

const app = express();
app.use(express.json());
app.use(cors({ origin: CLIENT_URL }));

const port = 3001;
const tickPeriod = 1000 / 60;

const SimulationStates = {
    NOT_STARTED: "notStarted",
    STARTED: "started",
    PAUSED: "paused",
    STOPPED: "stopped"
}

let simulationState = SimulationStates.NOT_STARTED;
let pendulum = null;
let simulationInterval = null;

app.get("/pendulum", (req, res) => {
    if (pendulum) {
        return res.json(pendulum.toJson());
    }

    return res.sendStatus(StatusCodes.PRECONDITION_REQUIRED);
});

app.post("/pendulum", (req, res) => {
    pendulum = new Pendulum(
        req.body.pivotPosition,
        req.body.bobPosition,
        req.body.angle,
        req.body.mass,
        req.body.bobRadius,
        NO_WIND,
        EARTH_GRAVITY,
    );

    simulationState = SimulationStates.STARTED;
    clearInterval(simulationInterval);
    simulationInterval = setInterval(() => pendulum.tick(tickPeriod), tickPeriod);

    return res.sendStatus(StatusCodes.CREATED);
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
