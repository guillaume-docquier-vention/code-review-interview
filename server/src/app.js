import { CLIENT_URL } from "./constants";
import { Cluster, PendulumInstance } from "./instances";

process.on("uncaughtException", err => {
    // eslint-disable-next-line no-console -- This is legit debugging
    console.log("uncaughtException...");
    // eslint-disable-next-line no-console -- This is legit debugging
    console.error(err);
});

const cluster = new Cluster([
    new PendulumInstance(3001, CLIENT_URL),
    new PendulumInstance(3002, CLIENT_URL),
    new PendulumInstance(3003, CLIENT_URL),
    new PendulumInstance(3004, CLIENT_URL),
    new PendulumInstance(3005, CLIENT_URL),
]);

cluster.start();
