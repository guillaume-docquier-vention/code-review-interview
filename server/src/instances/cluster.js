export class Cluster {
    constructor(instances) {
        this.instances = instances;
    }

    start() {
        const instanceUrls = this.instances.map(instance => instance.url);
        this.instances.forEach(instance => {
            instance.updateNeighbors(instanceUrls.filter(url => url !== instance.url));
            instance.start();
        });
    }
}
