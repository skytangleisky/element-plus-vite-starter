let scale = 0.25
const vertex = new Float32Array([
    -1.0*scale, +1.0*scale, 0,  1.0, 0.0, 0.0, 0.25,
    -1.0*scale, -1.0*scale, 0,  1.0, 0.0, 0.0, 0.25,
    +1.0*scale, -1.0*scale, 0,  1.0, 0.0, 0.0, 0.25,
    -1.0*scale, +1.0*scale, 0,  1.0, 0.0, 0.0, 1.0,
    +1.0*scale, +1.0*scale, 0,  1.0, 0.0, 0.0, 1.0,
    +1.0*scale, -1.0*scale, 0,  1.0, 0.0, 0.0, 1.0,
])
const vertexCount = 6

export {vertex, vertexCount}