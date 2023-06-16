import { mat4, vec3 } from '~/tools/gl-matrix'
// import { mat4, vec3 } from 'gl-matrix'
import { equals } from '../../tools/gl-matrix/quat2';

/*
    let position = {x:1,y:2,z:3}
    let rotation = {x:Math.PI/4,y:Math.PI/4,z:Math.PI/4}
    let scale = {x:1,y:2,z:3}
    const modelViewMatrix = mat4.create()
    const matrix = mat4.create()
    mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(position.x, position.y, position.z))
    mat4.multiply(matrix,mat4.fromValues(
        1,0,0,position.x,
        0,1,0,position.y,
        0,0,1,position.z,
        0,0,0,1),matrix)

    mat4.multiply(matrix,mat4.fromValues(
        1,0,0,0,
        0,Math.cos(rotation.x),Math.sin(rotation.x),0,
        0,-Math.sin(rotation.x),Math.cos(rotation.x),0,
        0,0,0,1),matrix)
    mat4.rotateX(modelViewMatrix, modelViewMatrix, rotation.x)


    mat4.multiply(matrix,mat4.fromValues(
        Math.cos(rotation.y),0,-Math.sin(rotation.y),0,
        0,1,0,0,
        Math.sin(rotation.y),0,Math.cos(rotation.y),0,
        0,0,0,1),matrix)
    mat4.rotateY(modelViewMatrix, modelViewMatrix, rotation.y)

    mat4.multiply(matrix,mat4.fromValues(
        Math.cos(rotation.z),Math.sin(rotation.z),0,0,
        -Math.sin(rotation.z),Math.cos(rotation.z),0,0,
        0,0,1,0,
        0,0,0,1),matrix)
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, rotation.z)

    mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(scale.x, scale.y, scale.z))
    mat4.multiply(matrix,mat4.fromValues(
        scale.x,0,0,0,
        0,scale.y,0,0,
        0,0,scale.z,0,
        0,0,0,1),matrix)
    console.log(mat4.equals(matrix,modelViewMatrix))
*/




/*
let aspect = 1
const fov = 90/180*Math.PI
let n = 1
let f = 2
let t = n*Math.tan(fov/2)
let b = -t
let r = t*aspect
let l = -r
const projectionMatrix1 = mat4.create()
mat4.multiply(
    projectionMatrix1,
    mat4.fromValues(
        n,0,0,0,
        0,n,0,0,
        0,0,f+n,-f*n,
        0,0,1,0
    ),
    projectionMatrix1
)
mat4.multiply(
    projectionMatrix1,
    mat4.fromValues(
        1,0,0,-(r+l)/2,
        0,1,0,-(t+b)/2,
        0,0,1,-(f+n)/2,
        0,0,0,1
    ),
    projectionMatrix1
)
mat4.multiply(
    projectionMatrix1, 
    mat4.fromValues(
        2/(r-l),0,0,0,
        0,2/(t-b),0,0,
        0,0,2/(f-n),0,
        0,0,0,1
    ),
    projectionMatrix1
)
const projectionMatrix2 = mat4.create()
mat4.perspectiveNO(projectionMatrix2, fov, aspect, n, f)
console.log(mat4.equals(projectionMatrix1,projectionMatrix2))
//Zrange [-1,1]->[0,1]
mat4.multiply(
    projectionMatrix1,
    mat4.fromValues(
        1,0,0,0,
        0,1,0,0,
        0,0,0.5,0.5,
        0,0,0,1
    ),
    projectionMatrix1
)
const projectionMatrix3 = mat4.create()
mat4.perspectiveZO(projectionMatrix3, fov, aspect, n, f)
console.log(mat4.equals(projectionMatrix1,projectionMatrix3))
*/

//投影矩阵

//P
// n 0  0   0
// 0 n  0   0
// 0 0 f+n -fn
// 0 0  1   0

//T
// 1 0 0 -(l+r)/2
// 0 1 0 -(t+b)/2
// 0 0 1 -(f+n)/2
// 0 0 0     1

//S
// 2/(r-l)   0        0    0
//   0     2/(t-b)    0    0
//   0       0     2/(f-n) 0
//   0       0        0    1

//Morth=S*T
// 2/(r-l)    0       0    -(r+l)/(r-l)
//    0    2/(t-b)    0    -(t+b)/(t-b)
//    0       0    2/(f-n) -(f+n)/(f-n)
//    0       0       0          1


//Mper=Morth*P=S*T*P
// 2n/(r-l)    0       -(r+l)/(r-l)     0
//    0     2n/(t-b)   -(t+b)/(t-b)     0
//    0        0        (f+n)/(f-n) -2fn/(f-n)
//    0        0           1            0

// Zrange [-1,1]->[0,1]
//   1 0  0   0
//   0 1  0   0
//   0 0 0.5 0.5
//   0 0  0   1


// return mvp matrix from given aspect, position, rotation, scale
function getMvpMatrix(
    size: {width:number,height:number},
    position: {x:number, y:number, z:number},
    rotation: {x:number, y:number, z:number},
    scale: {x:number, y:number, z:number}
){
    // get modelView Matrix
    const modelViewMatrix = getModelViewMatrix(position, rotation, scale)
    // get projection Matrix
    const projectionMatrix = getProjectionMatrix(size)
    // get mvp matrix
    const mvpMatrix = mat4.create()
    mat4.multiply(mvpMatrix,projectionMatrix,modelViewMatrix)
    mat4.transpose(mvpMatrix,mvpMatrix)
    // return matrix as Float32Array
    return mvpMatrix as Float32Array
    // return modelViewMatrix as Float32Array
}

// return modelView matrix from given position, rotation, scale
function getModelViewMatrix(
    position = {x:0, y:0, z:0},
    rotation = {x:0, y:0, z:0},
    scale = {x:1, y:1, z:1}
){
    const modelViewMatrix = mat4.create()
    mat4.rotateX(modelViewMatrix, modelViewMatrix, rotation.x)
    mat4.rotateY(modelViewMatrix, modelViewMatrix, rotation.y)
    mat4.rotateZ(modelViewMatrix, modelViewMatrix, rotation.z)
    mat4.scale(modelViewMatrix, modelViewMatrix, vec3.fromValues(scale.x, scale.y, scale.z))
    mat4.translate(modelViewMatrix, modelViewMatrix, vec3.fromValues(position.x, position.y, position.z))
    return modelViewMatrix as Float32Array
}

const center = vec3.fromValues(0,0,-1)
const up = vec3.fromValues(0,1,0)
function getGPUcoord(x:number,y:number,size:{width:number,height:number}){
    return {
        x:(x-size.width/2)/(size.width/2),
        y:-(y-size.height/2)/(size.height/2)
    }
}
function getProjectionMatrix(
    size: {width:number,height:number},
    fov:number = 90 / 180 * Math.PI,
    near:number = 0.1,
    far:number = 100.0,
    position = {x:0, y:0, z:0}
){
    // create cameraview
    const cameraView = mat4.create()
    const eye = vec3.fromValues(position.x, position.y, position.z)
    mat4.translate(cameraView, cameraView, eye)
    mat4.lookAt(cameraView, eye, center, up)
    // get a perspective Matrix
    const projectionMatrix1 = mat4.create()
    let aspect = size.width/size.height

    // let n = 1
    // let f = 2
    // let t = n*Math.tan(fov/2)
    // let b = -t
    // let r = t*aspect
    // let l = -r
    getGPUcoord(size.width,size.height,size)
    window.screen.height
    let n = 1
    let f = 2
    let t = 1
    let b =-1
    let r = 1
    let l =-1
    mat4.multiply(
        projectionMatrix1,
        mat4.fromValues(
            n,0,0,0,
            0,n,0,0,
            0,0,f+n,-f*n,
            0,0,1,0
        ),
        projectionMatrix1
    )
    mat4.multiply(
        projectionMatrix1,
        mat4.fromValues(
            1,0,0,-(r+l)/2,
            0,1,0,-(t+b)/2,
            0,0,1,-(f+n)/2,
            0,0,0,1
        ),
        projectionMatrix1
    )
    mat4.multiply(
        projectionMatrix1, 
        mat4.fromValues(
            2/(r-l),0,0,0,
            0,2/(t-b),0,0,
            0,0,2/(f-n),0,
            0,0,0,1
        ),
        projectionMatrix1
    )
    //Zrange [-1,1]->[0,1]
    mat4.multiply(
        projectionMatrix1,
        mat4.fromValues(
            1,0,0,0,
            0,1,0,0,
            0,0,0.5,0.5,
            0,0,0,1
        ),
        projectionMatrix1
    )
    const projectionMatrix = mat4.create()
    mat4.perspectiveZO(projectionMatrix, fov, aspect, n, f)
    // mat4.multiply(projectionMatrix, cameraView,projectionMatrix)
    return projectionMatrix1 as Float32Array
}

export { getMvpMatrix, getModelViewMatrix, getProjectionMatrix }