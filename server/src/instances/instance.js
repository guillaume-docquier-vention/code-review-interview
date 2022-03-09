import express from "express";
import cors from "cors";

export class Instance {
    constructor(port, clientUrl) {
        this.port = port;
        this.clientUrl = clientUrl;
    }

    start() {
        const app = express();
        app.use(express.json());
        app.use(cors({ origin: this.clientUrl }));

        this.setupRoutes(app);

        app.listen(this.port, () => {
            console.log(`Instance listening at http://localhost:${this.port}`);
        });
    }

    setupRoutes(app) {
        console.log(`No routes configured for this instance (${this.port}).`);
    }
}
