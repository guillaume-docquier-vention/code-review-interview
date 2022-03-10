import express from "express";
import cors from "cors";

export class Instance {
    constructor(port, clientUrl) {
        this.port = port;
        this.clientUrl = clientUrl;
        this.neighbors = [];
        this.url = `http://localhost:${this.port}`; // TODO There must be a way to get this
    }

    updateNeighbors(neighborUrls) {
        this.neighborUrls = neighborUrls;
    }

    start() {
        const app = express();
        app.use(express.json());
        app.use(cors({ origin: this.clientUrl }));

        this.setupRoutes(app);

        app.listen(this.port, () => {
            // eslint-disable-next-line no-console
            console.log(`[${new Date().toISOString()}] Instance listening at ${this.url}`);
        });
    }

    // eslint-disable-next-line no-unused-vars
    setupRoutes(app) {
        // eslint-disable-next-line no-console
        console.log(`[${new Date().toISOString()}] No routes configured for this instance (${this.port}).`);
    }
}
