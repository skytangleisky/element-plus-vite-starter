import WindGL from './index';
import json from "../data/2016112000.json";
import png from "../data/2016112000.png?url";
import {mat4} from 'gl-matrix';

export default class CustomLayer {
    constructor(json,png) {
        this.id = 'null-island';
        this.type = 'custom';
        this.renderingMode = '3d';
        this.json = json
        this.png = png
    }
    onAdd(map, gl) {
        this.map = map
        this.projectionName = this.map.getProjection().name
        this.wind = new WindGL(gl,{boundaries:[32,160,12,80]})//和micaps数据范围对应
        // this.wind = new WindGL(gl,{boundaries:[100.57,169.42999999999998,-10.38,50.30088389285023]})//和卫星云图位置对应
		this.wind.numParticles = 1024
            let windData = this.json
            const windImage = new Image();
            windImage.width = windData.width
            windImage.height=windData.height
            windData.image = windImage;
            windImage.src = this.png;
            windImage.onload = () => {
                this.wind.setWind(windData);
            };
        this.map.on("wheel", () => {
            this.wind.resize();
        });
        this.map.on("dragstart", () => {
            this.wind.resize();
        });
        this.map.on("move", () => {
            this.wind.resize();
        });
    }
    render(gl, projectionMatrix, projection, globeToMercMatrix, transition, centerInMercator, pixelsPerMeterRatio) {
        if (this.wind.windData) {
            if (projection && projection.name === 'globe') {
                if(this.projectionName!='globe'){
                    this.wind.resize()
                    this.projectionName='globe'
                }
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                mat4.multiply(projectionMatrix,projectionMatrix,globeToMercMatrix)
                this.wind.draw(projectionMatrix,1);
            }else{
                if(this.projectionName!='mercator'){
                    this.wind.resize()
                    this.projectionName='mercator'
                }
                gl.enable(gl.BLEND);
                gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
                this.wind.draw(projectionMatrix,0);
            }
            this.map.triggerRepaint();
        }
    }
    onRemove(map,gl){
        this.wind.dispose(map,gl)
        this.map.off("wheel",this.resize)
        this.map.off("dragstart",this.resize)
        this.map.off("move",this.resize)
    }
}
/*GLB,GLTF格式支持

import { wgs84togcj02 } from '~/myComponents/map/workers/mapUtil.js';
import './three.min.js'
import './GLTFLoader.js'
// const modelOrigin = [148.9819, -35.39847];//澳大利亚天文台
const modelOrigin = [104.06337515944892, 30.65985447500198];//成都
const modelAltitude = 3;
const modelRotate = [Math.PI / 2, 0, 0];

const modelAsMercatorCoordinate = mapboxgl.MercatorCoordinate.fromLngLat(
modelOrigin,
modelAltitude
);
const modelTransform = {
    translateX: modelAsMercatorCoordinate.x,
    translateY: modelAsMercatorCoordinate.y,
    translateZ: modelAsMercatorCoordinate.z,
    rotateX: modelRotate[0],
    rotateY: modelRotate[1],
    rotateZ: modelRotate[2],
    //  Since the 3D model is in real world meters, a scale transform needs to be applied since the CustomLayerInterface expects units in MercatorCoordinates.
    scale: modelAsMercatorCoordinate.meterInMercatorCoordinateUnits()*0.1
};
export default class CustomLayer{
    constructor(){
        this.id = '3d-model'
        this.type = 'custom'
        this.renderingMode = '3d'
    }
    onAdd(map, gl) {
        this.clock = new THREE.Clock();
        this.camera = new THREE.Camera();
        this.scene = new THREE.Scene();
        // create two three.js lights to illuminate the model
        const directionalLight = new THREE.DirectionalLight(0xffffff);
        directionalLight.position.set(0, -70, 100).normalize();
        this.scene.add(directionalLight);
        const directionalLight2 = new THREE.DirectionalLight(0xffffff);
        directionalLight2.position.set(0, 70, 100).normalize();
        this.scene.add(directionalLight2);

        // use the three.js GLTF loader to add the 3D model to the three.js scene
        const loader = new THREE.GLTFLoader();
        // let resource = location.origin+'/resources/34M_17.gltf'
        let resource = location.origin+'/resources/CesiumDrone.glb'
        // let resource = location.origin+'/resources/sr71.glb'
        loader.load(resource,(gltf) => {
            const scene = gltf.scene;
            this.scene.add(scene);
            const animations = gltf.animations;
            this.mixer = new THREE.AnimationMixer(scene);
            animations.forEach((clip) => {
                const action = this.mixer.clipAction(clip);
                action.play();
            });
        })
        this.map = map;

        // use the Mapbox GL JS map canvas for three.js
        this.renderer = new THREE.WebGLRenderer({
            canvas: map.getCanvas(),
            context: gl,
            antialias: true
        });

        this.renderer.autoClear = false;
    }
    render(gl, matrix) {
        const rotationX = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(1, 0, 0),modelTransform.rotateX);
        const rotationY = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 1, 0),modelTransform.rotateY);
        const rotationZ = new THREE.Matrix4().makeRotationAxis(new THREE.Vector3(0, 0, 1),modelTransform.rotateZ);

        const m = new THREE.Matrix4().fromArray(matrix);
        const l = new THREE.Matrix4().makeTranslation(
            modelTransform.translateX,
            modelTransform.translateY,
            modelTransform.translateZ
        )
        .scale(
            new THREE.Vector3(modelTransform.scale,-modelTransform.scale,modelTransform.scale)
        )
        .multiply(rotationX)
        .multiply(rotationY)
        .multiply(rotationZ);

        this.camera.projectionMatrix = m.multiply(l);
        this.renderer.resetState();
        this.renderer.render(this.scene, this.camera);
        this.map.triggerRepaint();
        if (this.mixer) {
            this.mixer.update(this.clock.getDelta()); // 更新动画
        }
    }
}

*/




/*

import '//unpkg.com/satellite.js/dist/satellite.min.js'
import txt from './space-track-leo.txt?url'

const KM_TO_M = 0;
const TIME_STEP = 3;

const globeVertCode = `
    attribute vec3 a_pos_ecef;
    attribute vec3 a_pos_merc;

    uniform mat4 u_projection;
    uniform mat4 u_globeToMercMatrix;
    uniform float u_globeToMercatorTransition;
    uniform vec2 u_centerInMerc;
    uniform float u_pixelsPerMeterRatio;

    void main() {
        vec4 p = u_projection * u_globeToMercMatrix * vec4(a_pos_ecef, 1.);
        p /= p.w;
        if (u_globeToMercatorTransition > 0.) {

            vec4 merc = vec4(a_pos_merc, 1.);
            merc.xy = (merc.xy - u_centerInMerc) * u_pixelsPerMeterRatio + u_centerInMerc;
            merc.z *= u_pixelsPerMeterRatio;

            merc = u_projection * merc;
            merc /= merc.w;
            p = mix(p, merc, u_globeToMercatorTransition);
        }
        gl_PointSize = 10.;
        gl_Position = p;
    }
`;

const mercVertCode = `
    precision highp float;
    attribute vec3 a_pos_merc;
    uniform mat4 u_projection;

    void main() {
        gl_PointSize = 10.;
        gl_Position = u_projection * vec4(a_pos_merc, 1.);
    }
`;

const fragCode = `
    precision highp float;
    uniform vec4 u_color;

    void main() {
        gl_FragColor = vec4(1., 0., 0., 1.);
    }
`;

let time = new Date();

function createShader(gl, src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    const message = gl.getShaderInfoLog(shader);
    if (message.length > 0) {
        console.error(message);
    }
    return shader;
};

function createProgram(gl, vert, frag) {
    var vertShader = createShader(gl, vert, gl.VERTEX_SHADER);
    var fragShader = createShader(gl, frag, gl.FRAGMENT_SHADER);

    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.validateProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        console.error(`Could not compile WebGL program. \n\n${info}`);
    }

    return program;
};

function updateVboAndActivateAttrib(gl, prog, vbo, data, attribName) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
    const attribLoc = gl.getAttribLocation(prog, attribName);
    gl.vertexAttribPointer(attribLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribLoc);
}

export default class CustomLayer {
    constructor(){
        this.id='satellites'
        this.type='custom'
    }
    onAdd (map, gl) {
        this.map = map;

        this.posEcef = [];
        this.posMerc = [];

        this.posEcefVbo = gl.createBuffer();
        this.posMercVbo = gl.createBuffer();

        this.globeProgram = createProgram(gl, globeVertCode, fragCode);
        this.mercProgram = createProgram(gl, mercVertCode, fragCode);

        fetch(txt).then(r => r.text()).then(rawData => {
            const tleData = rawData.replace(/\r/g, '')
                .split(/\n(?=[^12])/)
                .filter(d => d)
                .map(tle => tle.split('\n'));
            this.satData = tleData.map(([name, ...tle]) => ({
                satrec: satellite.twoline2satrec(...tle),
                name: name.trim().replace(/^0 /, '')
            }))
            // exclude those that can't be propagated
            .filter(d => !!satellite.propagate(d.satrec, new Date()).position)
            .slice(0, 300);
            this.updateBuffers();
        });
    }
    updateBuffers() {
        time = new Date(+time + TIME_STEP);
        const gmst = satellite.gstime(time);
        this.posEcef = [];
        this.posMerc = [];
        for (let i = 0; i < this.satData.length; ++i) {
            const satrec = this.satData[i].satrec;
            const eci = satellite.propagate(satrec, time);
            if (eci.position) {
                const geodetic = satellite.eciToGeodetic(eci.position, gmst);

                let lngLat = [satellite.degreesLong(geodetic.longitude), satellite.degreesLat(geodetic.latitude)];
                // lngLat = [0,0]
                const altitude = geodetic.height * KM_TO_M;
                try{
                    const merc = mapboxgl.MercatorCoordinate.fromLngLat(lngLat, altitude);
                    this.posMerc.push(...[merc.x, merc.y, merc.z]);

                    const ecef = mapboxgl.LngLat.convert(lngLat).toEcef(altitude);
                    this.posEcef.push(...ecef);
                }catch{
                    // console.log(i,geodetic)
                }
            }
        }
        console.log(this.posMerc,this.posEcef)
    }
    render (gl, projectionMatrix, projection, globeToMercMatrix, transition, centerInMercator, pixelsPerMeterRatio) {
        if (this.satData) {
            this.updateBuffers();
            const primitiveCount = this.posEcef.length / 3;
            gl.disable(gl.DEPTH_TEST);
            if (projection && projection.name === 'globe') { // globe projection and globe to mercator transition
                gl.useProgram(this.globeProgram);
                updateVboAndActivateAttrib(gl, this.globeProgram, this.posEcefVbo, this.posEcef, "a_pos_ecef");
                updateVboAndActivateAttrib(gl, this.globeProgram, this.posMercVbo, this.posMerc, "a_pos_merc");
                gl.uniformMatrix4fv(gl.getUniformLocation(this.globeProgram, "u_projection"), false, projectionMatrix);
                gl.uniformMatrix4fv(gl.getUniformLocation(this.globeProgram, "u_globeToMercMatrix"), false, globeToMercMatrix);
                gl.uniform1f(gl.getUniformLocation(this.globeProgram, "u_globeToMercatorTransition"), transition);
                gl.uniform2f(gl.getUniformLocation(this.globeProgram, "u_centerInMerc"), centerInMercator[0], centerInMercator[1]);
                gl.uniform1f(gl.getUniformLocation(this.globeProgram, "u_pixelsPerMeterRatio"), pixelsPerMeterRatio);

                gl.drawArrays(gl.POINTS, 0, primitiveCount);
            } else { // mercator projection
                gl.useProgram(this.mercProgram);
                updateVboAndActivateAttrib(gl, this.mercProgram, this.posMercVbo, this.posMerc, "a_pos_merc");
                gl.uniformMatrix4fv(gl.getUniformLocation(this.mercProgram, "u_projection"), false, projectionMatrix);
                gl.drawArrays(gl.POINTS, 0, primitiveCount);
            }
            this.map.triggerRepaint();
        }
    }
};
*/




/*
function createShader(gl, src, type) {
    var shader = gl.createShader(type);
    gl.shaderSource(shader, src);
    gl.compileShader(shader);
    const message = gl.getShaderInfoLog(shader);
    if (message.length > 0) {
        console.error(message);
    }
    return shader;
};
function createProgram(gl, vert, frag) {
    var vertShader = createShader(gl, vert, gl.VERTEX_SHADER);
    var fragShader = createShader(gl, frag, gl.FRAGMENT_SHADER);
    var program = gl.createProgram();
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
    gl.validateProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        const info = gl.getProgramInfoLog(program);
        console.error(`Could not compile WebGL program. \n\n${info}`);
    }
    return program;
};
function updateVboAndActivateAttrib(gl, prog, vbo, data, attribName) {
    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.DYNAMIC_DRAW);
    const attribLoc = gl.getAttribLocation(prog, attribName);
    gl.vertexAttribPointer(attribLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(attribLoc);
}
export default class CustomLayer {
    constructor(){
        this.id='satellites'
        this.type='custom'
        this.renderingMode = '3d';
    }
    onAdd (map, gl) {
        const globeVertCode = `
            attribute vec3 a_pos_ecef;
            attribute vec3 a_pos_merc;
            uniform mat4 u_projection;
            uniform mat4 u_globeToMercMatrix;
            uniform float u_globeToMercatorTransition;
            uniform vec2 u_centerInMerc;
            uniform float u_pixelsPerMeterRatio;
            void main() {
                vec4 p = u_projection * u_globeToMercMatrix * vec4(a_pos_ecef, 1.);
                p /= p.w;
                if (u_globeToMercatorTransition > 0.) {
                    vec4 merc = vec4(a_pos_merc, 1.);
                    merc.xy = (merc.xy - u_centerInMerc) * u_pixelsPerMeterRatio + u_centerInMerc;
                    merc.z *= u_pixelsPerMeterRatio;
                    merc = u_projection * merc;
                    merc /= merc.w;
                    p = mix(p, merc, u_globeToMercatorTransition);
                }
                gl_PointSize = 10.;
                gl_Position = p;
            }
        `;
        const mercVertCode = `
            precision highp float;
            attribute vec3 a_pos_merc;
            uniform mat4 u_projection;
            void main() {
                gl_PointSize = 10.;
                gl_Position = u_projection * vec4(a_pos_merc, 1.);
            }
        `;
        const fragCode = `
            precision highp float;
            uniform vec4 u_color;
            void main() {
                gl_FragColor = vec4(1., 0., 0., 1.);
            }
        `;
        this.map = map;
        this.posEcef = [];
        this.posMerc = [];
        this.posEcefVbo = gl.createBuffer();
        this.posMercVbo = gl.createBuffer();
        this.globeProgram = createProgram(gl, globeVertCode, fragCode);
        this.mercProgram = createProgram(gl, mercVertCode, fragCode);
        this.satData = [{lng:0,lat:0,altitude:0}]
    }
    render (gl, projectionMatrix, projection, globeToMercMatrix, transition, centerInMercator, pixelsPerMeterRatio) {
        if (this.satData) {
            this.posEcef = [];
            this.posMerc = [];
            for (let i = 0; i < this.satData.length; ++i) {
                let item = this.satData[i]
                const merc = mapboxgl.MercatorCoordinate.fromLngLat([item.lng,item.lat], item.altitude);
                this.posMerc.push(...[merc.x, merc.y, merc.z]);
                // const ecef = mapboxgl.LngLat.convert([item.lng,item.lat]).toEcef(item.altitude);
                const ecef = mapboxgl.LngLat.convert([item.lng,item.lat]).toEcef(0);
                console.log(ecef)
                this.posEcef.push(...ecef);
            }
            const primitiveCount = this.posEcef.length / 3;
            gl.disable(gl.DEPTH_TEST);
            if (projection && projection.name === 'globe') { // globe projection and globe to mercator transition
                gl.useProgram(this.globeProgram);
                updateVboAndActivateAttrib(gl, this.globeProgram, this.posEcefVbo, this.posEcef, "a_pos_ecef");
                updateVboAndActivateAttrib(gl, this.globeProgram, this.posMercVbo, this.posMerc, "a_pos_merc");
                gl.uniformMatrix4fv(gl.getUniformLocation(this.globeProgram, "u_projection"), false, projectionMatrix);
                gl.uniformMatrix4fv(gl.getUniformLocation(this.globeProgram, "u_globeToMercMatrix"), false, globeToMercMatrix);
                gl.uniform1f(gl.getUniformLocation(this.globeProgram, "u_globeToMercatorTransition"), transition);
                gl.uniform2f(gl.getUniformLocation(this.globeProgram, "u_centerInMerc"), centerInMercator[0], centerInMercator[1]);
                gl.uniform1f(gl.getUniformLocation(this.globeProgram, "u_pixelsPerMeterRatio"), pixelsPerMeterRatio);
                gl.drawArrays(gl.POINTS, 0, primitiveCount);
            } else { // mercator projection
                gl.useProgram(this.mercProgram);
                updateVboAndActivateAttrib(gl, this.mercProgram, this.posMercVbo, this.posMerc, "a_pos_merc");
                gl.uniformMatrix4fv(gl.getUniformLocation(this.mercProgram, "u_projection"), false, projectionMatrix);
                gl.drawArrays(gl.POINTS, 0, primitiveCount);
            }
            this.map.triggerRepaint();
        }
    }
};
*/






/*
export default class NullIslandLayer {
    constructor() {
        this.id = 'null-island';
        this.type = 'custom';
        this.renderingMode = '2d';
    }
    onAdd(map, gl) {
        const vertexSource2 = `
        uniform mat4 u_projectionMatrix;
        uniform mat4 u_globeToMercMatrix;
        void main() {
            gl_Position = u_projectionMatrix * u_globeToMercMatrix * vec4(0.0, 0.0, 1303.7972938088067, 1.0);
            gl_PointSize = 20.0;
        }`;
        const fragmentSource = `
        void main() {
            gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
        }`;
        const vertexShader2 = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader2, vertexSource2);
        gl.compileShader(vertexShader2);
        const fragmentShader2 = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader2, fragmentSource);
        gl.compileShader(fragmentShader2);
        this.program2 = gl.createProgram();
        gl.attachShader(this.program2, vertexShader2);
        gl.attachShader(this.program2, fragmentShader2);
        gl.linkProgram(this.program2);

        const vertexSource = `
        uniform mat4 u_projectionMatrix;
        uniform mat4 u_globeToMercMatrix;
        void main() {
            gl_Position = u_projectionMatrix * vec4(0.5, 0.5, 0.0, 1.0);
            gl_PointSize = 20.0;
        }`;
        const vertexShader = gl.createShader(gl.VERTEX_SHADER);
        gl.shaderSource(vertexShader, vertexSource);
        gl.compileShader(vertexShader);
        const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(fragmentShader, fragmentSource);
        gl.compileShader(fragmentShader);
        this.program = gl.createProgram();
        gl.attachShader(this.program, vertexShader);
        gl.attachShader(this.program, fragmentShader);
        gl.linkProgram(this.program);
    }
    render(gl, projectionMatrix, projection, globeToMercMatrix, transition, centerInMercator, pixelsPerMeterRatio) {
        if(projection && projection.name === 'globe'){
            gl.useProgram(this.program2);
            gl.uniformMatrix4fv(gl.getUniformLocation(this.program2, "u_projectionMatrix"), false, projectionMatrix);
            gl.uniformMatrix4fv(gl.getUniformLocation(this.program2, "u_globeToMercMatrix"), false, globeToMercMatrix);
            gl.drawArrays(gl.POINTS, 0, 1);
        }else{
            gl.useProgram(this.program);
            gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "u_projectionMatrix"), false, projectionMatrix);
            gl.drawArrays(gl.POINTS, 0, 1);
        }
    }
}
*/