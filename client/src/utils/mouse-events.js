export const getMouseCoords = e => ({
    x: e.nativeEvent.layerX,
    y: e.nativeEvent.layerY
});

export const getMouseDelta = e => ({
    x: e.movementX,
    y: e.movementY
});
