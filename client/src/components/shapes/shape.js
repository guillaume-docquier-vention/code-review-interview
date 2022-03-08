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

    // Maybe these template methods are not so necessary after all
    mouseDown(position) {
        if (this.contains(position)) {
            this.onMouseDown(position);
        }
    }

    mouseMove(position, delta) {
        this.onMouseMove(position, delta);
    }

    mouseUp(position) {
        this.onMouseUp(position);
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
