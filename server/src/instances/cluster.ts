import type { PendulumInstance } from './pendulum'

export class Cluster {
    private readonly instances: PendulumInstance[]

    public constructor(instances: PendulumInstance[]) {
        this.instances = instances;
    }

    public start(): void {
        const instanceUrls = this.instances.map(instance => instance.url);
        this.instances.forEach(instance => {
            instance.updateNeighbors(instanceUrls.filter(url => url !== instance.url));
            instance.start();
        });
    }
}
