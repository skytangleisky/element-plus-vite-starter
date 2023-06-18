let scale = 0.5
const vertex = new Float32Array([
    -1.0*scale, +1.0*scale, 0,  1.0, 0.0, 0.0, 0.5,
    -1.0*scale, -1.0*scale, 0,  1.0, 0.0, 0.0, 0.5,
    +1.0*scale, -1.0*scale, 0,  1.0, 0.0, 0.0, 0.5,
    -1.0*scale, +1.0*scale, 0,  1.0, 0.0, 0.0, 0.5,
    +1.0*scale, +1.0*scale, 0,  1.0, 0.0, 0.0, 0.5,
    +1.0*scale, -1.0*scale, 0,  1.0, 0.0, 0.0, 0.5,
])
const vertexCount = 6

export {vertex, vertexCount}