// export default class CustomLayer {
//     constructor() {
//         this.id = 'null-island';
//         this.type = 'custom';
//         this.renderingMode = '3d';
//     }
//     onAdd(map, gl) {
//         const vertexSource = `
//         uniform mat4 u_matrix;
//         void main() {
//             gl_Position = u_matrix * vec4(0.5, 0.5, 0.0, 1.0);
//             gl_PointSize = 20.0;
//         }`;
//         const fragmentSource = `
//         void main() {
//             gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//         }`;
//         const vertexShader = gl.createShader(gl.VERTEX_SHADER);
//         gl.shaderSource(vertexShader, vertexSource);
//         gl.compileShader(vertexShader);
//         const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
//         gl.shaderSource(fragmentShader, fragmentSource);
//         gl.compileShader(fragmentShader);
//         this.program = gl.createProgram();
//         gl.attachShader(this.program, vertexShader);
//         gl.attachShader(this.program, fragmentShader);
//         gl.linkProgram(this.program);
//     }
//     render(gl, matrix) {
//         gl.useProgram(this.program);
//         gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "u_matrix"), false, matrix);
//         gl.drawArrays(gl.POINTS, 0, 1);
//     }
// }
import { mat4 } from '~/tools/gl-matrix/index.js'
import WindGL from './index';
import json from "../data/2016112000.json?url";
import png from "../data/2016112000.png?url";
export default class CustomLayer {
    constructor() {
        this.id = 'null-island';
        this.type = 'custom';
        this.renderingMode = '2d';
    }
    onAdd(map, gl) {
        this.map = map
        this.wind = new WindGL(gl)
		this.wind.numParticles = 655350
        const xhr = new XMLHttpRequest();
        xhr.responseType = "json";
        xhr.open("get", json, true);
        xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
                let windData = xhr.response
                const windImage = new Image();
                windData.image = windImage;
                windImage.src = png;
                windImage.onload = () => {
                    this.wind.setWind(windData);
                };
            } else {
                throw new Error(xhr.statusText);
            }
        };
        xhr.send();
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
    render(gl, matrix) {
        if (this.wind.windData) {
            // wind.resize();
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            this.wind.draw(matrix);
            this.map.triggerRepaint();
            return true;
        }
    }
}
