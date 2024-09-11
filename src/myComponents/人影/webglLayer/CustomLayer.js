export default class NullIslandLayer {
    constructor() {
        this.id = 'null-island';
        this.type = 'custom';
        this.renderingMode = '2d';
    }
    onAdd(map, gl) {
        this.map = map
        const vertexSource2 = `
        precision highp float;
        uniform mat4 u_projectionMatrix;
        uniform mat4 u_globeToMercMatrix;
        void main() {
            gl_Position = u_projectionMatrix * u_globeToMercMatrix * vec4(0.0, 0.0, 1303.7972938088067, 1.0);
            gl_PointSize = 20.0;
        }`;
        const fragmentSource = `
        void main() {
            precision highp float;
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
        precision highp float;
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
        // this.map.triggerRepaint();
    }
}
