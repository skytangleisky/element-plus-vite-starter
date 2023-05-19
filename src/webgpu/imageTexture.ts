import { onBeforeMount } from 'vue'
import basicVert from './shaders/basic.vert.wgsl?raw'
import imageTexture from './shaders/imageTexture.frag.wgsl?raw'
import * as cube from './util/cube'
import { getMvpMatrix } from './util/math'
// import textureUrl from '/texture.webp?url'
import textureUrl from '../assets/aircraft.png?url'
let aid:number
// initialize webgpu device & config canvas context
async function initWebGPU(canvas: HTMLCanvasElement) {
    if (!navigator.gpu)
        throw new Error('Not Support WebGPU')
    const adapter = await navigator.gpu.requestAdapter()
    if (!adapter)
        throw new Error('No Adapter Found')
    const device = await adapter.requestDevice()
    const context = canvas.getContext('webgpu') as GPUCanvasContext
    const format = navigator.gpu.getPreferredCanvasFormat()
    const devicePixelRatio = window.devicePixelRatio || 1
    canvas.width = canvas.clientWidth * devicePixelRatio
    canvas.height = canvas.clientHeight * devicePixelRatio
    const size = {width: canvas.width, height: canvas.height}
    context.configure({
        device, format,
        // prevent chrome warning after v102
        alphaMode: 'premultiplied'
    })
    return { device, context, format, size }
}

// create pipiline & buffers
async function initPipeline(device: GPUDevice, format: GPUTextureFormat, size: { width: number, height: number }) {
    const pipeline = await device.createRenderPipelineAsync({
        label: 'Basic Pipline',
        layout: 'auto',
        vertex: {
            module: device.createShaderModule({
                code: basicVert,
            }),
            entryPoint: 'main',
            buffers: [{
                arrayStride: 5 * 4, // 3 position 2 uv,
                attributes: [
                    {
                        // position
                        shaderLocation: 0,
                        offset: 0,
                        format: 'float32x3'
                    },
                    {
                        // uv
                        shaderLocation: 1,
                        offset: 3 * 4,
                        format: 'float32x2'
                    }
                ]
            }]
        },
        fragment: {
            module: device.createShaderModule({
                code: imageTexture,
            }),
            entryPoint: 'main',
            targets: [
                {
                    format: format
                }
            ]
        },
        primitive: {
            // topology: 'triangle-list',
            topology: 'triangle-strip',
            // Culling backfaces pointing away from the camera
            cullMode: 'none',
            // frontFace: 'ccw'
        },
        // Enable depth testing since we have z-level positions
        // Fragment closest to the camera is rendered in front
        depthStencil: {
            depthWriteEnabled: true,
            depthCompare: 'less',
            format: 'depth24plus'
        }
    } as GPURenderPipelineDescriptor)
    // create depthTexture for renderPass
    const depthTexture = device.createTexture({
        size, format: 'depth24plus',
        usage: GPUTextureUsage.RENDER_ATTACHMENT
    })
    const depthView = depthTexture.createView()
    // create vertex buffer
    const vertexBuffer = device.createBuffer({
        label: 'GPUBuffer store vertex',
        size: cube.vertex.byteLength,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST
    })
    device.queue.writeBuffer(vertexBuffer, 0, cube.vertex)
    // create a mvp matrix buffer
    const mvpBuffer = device.createBuffer({
        label: 'GPUBuffer store 4x4 matrix',
        size: 4 * 4 * 4, // 4 x 4 x float32
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST
    })
    // create a uniform group contains matrix
    const uniformGroup = device.createBindGroup({
        label: 'Uniform Group with Matrix',
        layout: pipeline.getBindGroupLayout(0),
        entries: [
            {
                binding: 0,
                resource: {
                    buffer: mvpBuffer
                }
            }
        ]
    })
    // return all vars
    return { pipeline, vertexBuffer, mvpBuffer, uniformGroup, depthTexture, depthView }
}

// create & submit device commands
function draw(
    device: GPUDevice,
    context: GPUCanvasContext,
    pipelineObj: {
        pipeline: GPURenderPipeline
        vertexBuffer: GPUBuffer
        mvpBuffer: GPUBuffer
        uniformGroup: GPUBindGroup
        depthView: GPUTextureView
    },
    textureGroup: GPUBindGroup
) {
    // start encoder
    const commandEncoder = device.createCommandEncoder()
    const renderPassDescriptor: GPURenderPassDescriptor = {
        colorAttachments: [
            {
                view: context.getCurrentTexture().createView(),
                clearValue: { r: 0, g: 0, b: 0, a: 0 },
                loadOp: 'clear',
                storeOp: 'store'
            }
        ],
        depthStencilAttachment: {
            view: pipelineObj.depthView,
            depthClearValue: 1.0,
            depthLoadOp: 'clear',
            depthStoreOp: 'store',
        }
    }
    const passEncoder = commandEncoder.beginRenderPass(renderPassDescriptor)
    passEncoder.setPipeline(pipelineObj.pipeline)
    // set uniformGroup
    passEncoder.setBindGroup(0, pipelineObj.uniformGroup)
    // set textureGroup
    passEncoder.setBindGroup(1, textureGroup)
    // set vertex
    passEncoder.setVertexBuffer(0, pipelineObj.vertexBuffer)
    // draw vertex count of cube
    passEncoder.draw(cube.vertexCount)
    passEncoder.end()
    // webgpu run in a separate process, all the commands will be executed after submit
    device.queue.submit([commandEncoder.finish()])
}
export function cancel(){
    window.cancelAnimationFrame(aid)
}

export default async function run(canvas:HTMLCanvasElement) {
    if (!canvas)
        throw new Error('No Canvas')
    const { device, context, format, size } = await initWebGPU(canvas)
    const pipelineObj = await initPipeline(device, format, size)

    // fetch an image and upload to GPUTexture
    const res = await fetch(textureUrl)
    const img = await res.blob()
    // const img = document.createElement('img')
    // img.src = textureUrl
    // await img.decode()
    const bitmap = await createImageBitmap(img)
    const textureSize = [bitmap.width, bitmap.height]
    // create empty texture
    const texture = device.createTexture({
        size: textureSize,
        format: 'rgba8unorm',
        usage:
            GPUTextureUsage.TEXTURE_BINDING |
            GPUTextureUsage.COPY_DST |
            GPUTextureUsage.RENDER_ATTACHMENT
    })
    // update image to GPUTexture
    device.queue.copyExternalImageToTexture(
        { source: bitmap },
        { texture: texture },
        textureSize
    )
    // Create a sampler with linear filtering for smooth interpolation.
    const sampler = device.createSampler({
        addressModeU:'clamp-to-edge',
        addressModeV: 'clamp-to-edge',
        magFilter: 'linear',
        minFilter: 'linear'
    })
    const textureGroup = device.createBindGroup({
        label: 'Texture Group with Texture/Sampler',
        layout: pipelineObj.pipeline.getBindGroupLayout(1),
        entries: [
            {
                binding: 0,
                resource: sampler
            },
            {
                binding: 1,
                resource: texture.createView()
            }
        ]
    })

    // default state
    let aspect = size.width / size.height
    const position = { x: 0, y: 0, z: -50 }
    const scale = { x: 1, y: 1, z: 0 }
    const rotation = { x: 0, y: 0, z: 0 }
    // start loop
    let lastTime=0;
    let frame=0
    let preTime=performance.now();
    let vy = 1/100
    let vx = 1/80
    function loop(time:number) {
        frame++
        if(time-lastTime>1000){
            $('#fps').html('FPS:'+(frame*1000/(time-lastTime)).toFixed(2))
            frame=0
            lastTime = time
        }
        let deltaTime = time-preTime
        preTime = time
        // rotate by time, and update transform matrix
        const now = time / 1000
        // rotation.x = Math.sin(now)
        // rotation.y = Math.cos(now)
        // let deltaX = deltaTime*vx
        // let deltaY = deltaTime*vy
        let deltaX = deltaTime*vx*Math.sin(now)
        let deltaY = deltaTime*vy*Math.cos(now)
        position.x+=deltaX
        position.y+=deltaY
        // if(position.x>20||position.x<-20){
        //     vx = -vx
        // }
        // if(position.y>20||position.y<-20){
        //     vy = -vy
        // }
        rotation.z = Math.atan2(-deltaX,deltaY)
        const mvpMatrix = getMvpMatrix(aspect, position, rotation, scale)
        device.queue.writeBuffer(
            pipelineObj.mvpBuffer,
            0,
            mvpMatrix.buffer
        )
        // then draw
        draw(device, context, pipelineObj, textureGroup)
        aid = requestAnimationFrame(loop)
    }
    loop(performance.now())


    // re-configure context on resize
    window.addEventListener('resize', () => {
        console.log('ratio',devicePixelRatio)
        size.width = canvas.width = canvas.clientWidth * devicePixelRatio
        size.height = canvas.height = canvas.clientHeight * devicePixelRatio
        // don't need to recall context.configure() after v104
        // re-create depth texture
        pipelineObj.depthTexture.destroy()
        pipelineObj.depthTexture = device.createTexture({
            size, format: 'depth24plus',
            usage: GPUTextureUsage.RENDER_ATTACHMENT,
        })
        pipelineObj.depthView = pipelineObj.depthTexture.createView()
        // update aspect
        aspect = size.width / size.height
    })
}