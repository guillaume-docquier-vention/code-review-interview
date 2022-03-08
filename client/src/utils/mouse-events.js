export const getMouseCoords = e => ({
    x: e.nativeEvent.offsetX,
    y: e.nativeEvent.offsetY
});

export const getMouseDelta = e => ({
    x: e.movementX,
    y: e.movementY
});
