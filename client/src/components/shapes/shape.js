export class Shape {
    constructor() {
        if (this.constructor === Shape) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    contains(x, y) {
        throw new Error("Method 'contains(x, y)' must be implemented.");
    }
}