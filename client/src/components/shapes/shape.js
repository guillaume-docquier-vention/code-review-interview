export class Shape {
    constructor() {
        if (this.constructor === Shape) {
            throw new Error("Abstract classes can't be instantiated.");
        }
    }

    contains(position) {
        throw new Error("Method 'contains(position)' must be implemented.");
    }

    render(ctx) {
        throw new Error("Method 'render(ctx)' must be implemented.");
    }

    onMouseDown(position) {
        throw new Error("Method 'onMouseDown(position)' must be implemented.");
    }

    onMouseMove(position) {
        throw new Error("Method 'onMouseMove(position)' must be implemented.");
    }

    drag(delta) {
        return;
    }

    onMouseUp(position) {
        throw new Error("Method 'onMouseDown(position)' must be implemented.");
    }
}
