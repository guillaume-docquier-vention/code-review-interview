import express, { type Express } from "express";
import cors from "cors";

export class Instance {
    protected readonly port: number
    private readonly clientUrl: string
    private readonly neighbors: string[] // ??
    public readonly url: string
    protected neighborUrls: string[]

    public constructor(port: number, clientUrl: string) {
        this.port = port;
        this.clientUrl = clientUrl;
        this.neighbors = [];
        this.neighborUrls = [];
        this.url = `http://localhost:${this.port}`; // TODO There must be a way to get this
    }

    public updateNeighbors(neighborUrls: string[]): void {
        this.neighborUrls = neighborUrls;
    }

    public start(): void {
        const app = express();
        app.use(express.json());
        app.use(cors({ origin: this.clientUrl }));

        this.setupRoutes(app);

        app.listen(this.port, () => {
            console.log(`[${new Date().toISOString()}] Instance listening at ${this.url}`);
        });
    }

    protected setupRoutes(app: Express): void {
        console.log(`[${new Date().toISOString()}] No routes configured for this instance (${this.port}).`);
    }
}
