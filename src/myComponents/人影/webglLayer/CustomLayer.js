// export default class NullIslandLayer {
//     constructor() {
//         this.id = 'null-island';
//         this.type = 'custom';
//         this.renderingMode = '2d';
//     }
//     onAdd(map, gl) {
//         this.map = map
//         const vertexSource2 = `
//         precision highp float;
//         uniform mat4 u_projectionMatrix;
//         uniform mat4 u_globeToMercMatrix;
//         void main() {
//             gl_Position = u_projectionMatrix * u_globeToMercMatrix * vec4(0.0, 0.0, 1303.7972938088067, 1.0);
//             gl_PointSize = 20.0;
//         }`;
//         const fragmentSource = `
//         void main() {
//             precision highp float;
//             gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
//         }`;
//         const vertexShader2 = gl.createShader(gl.VERTEX_SHADER);
//         gl.shaderSource(vertexShader2, vertexSource2);
//         gl.compileShader(vertexShader2);
//         const fragmentShader2 = gl.createShader(gl.FRAGMENT_SHADER);
//         gl.shaderSource(fragmentShader2, fragmentSource);
//         gl.compileShader(fragmentShader2);
//         this.program2 = gl.createProgram();
//         gl.attachShader(this.program2, vertexShader2);
//         gl.attachShader(this.program2, fragmentShader2);
//         gl.linkProgram(this.program2);

//         const vertexSource = `
//         precision highp float;
//         uniform mat4 u_projectionMatrix;
//         uniform mat4 u_globeToMercMatrix;
//         void main() {
//             gl_Position = u_projectionMatrix * vec4(0.5, 0.5, 0.0, 1.0);
//             gl_PointSize = 20.0;
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
//     render(gl, projectionMatrix, projection, globeToMercMatrix, transition, centerInMercator, pixelsPerMeterRatio) {
//         if(projection && projection.name === 'globe'){
//             gl.useProgram(this.program2);
//             gl.uniformMatrix4fv(gl.getUniformLocation(this.program2, "u_projectionMatrix"), false, projectionMatrix);
//             gl.uniformMatrix4fv(gl.getUniformLocation(this.program2, "u_globeToMercMatrix"), false, globeToMercMatrix);
//             gl.drawArrays(gl.POINTS, 0, 1);
//         }else{
//             gl.useProgram(this.program);
//             gl.uniformMatrix4fv(gl.getUniformLocation(this.program, "u_projectionMatrix"), false, projectionMatrix);
//             gl.drawArrays(gl.POINTS, 0, 1);
//         }
//         // this.map.triggerRepaint();
//     }
// }


// let animTime = 0
// let mapInstance
// export default {
//     id: 'highlight',
//     type: 'custom',
//     onAdd: function (map, gl) {
//         mapInstance = map
//         var vertexSource = `
//         precision highp float;
//         uniform mat4 u_matrix;
//         uniform float  anim;
//         attribute vec2 a_pos;
//         void main() {
//             gl_Position = u_matrix * vec4(a_pos,anim , 1.0);
//         }
//         `
//         var fragmentSource = `
//         precision highp float;
//         void main() {
//             gl_FragColor = vec4(1.0, 0.0, 0.0, 0.5);
//         }
//         `
//         var vertexShader = gl.createShader(gl.VERTEX_SHADER);
//         gl.shaderSource(vertexShader, vertexSource);
//         gl.compileShader(vertexShader);
//         var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
//         gl.shaderSource(fragmentShader, fragmentSource);
//         gl.compileShader(fragmentShader);
//         this.program = gl.createProgram();
//         gl.attachShader(this.program, vertexShader);
//         gl.attachShader(this.program, fragmentShader);
//         gl.linkProgram(this.program);
//         this.aPos = gl.getAttribLocation(this.program, 'a_pos');
//         this.unifromAnim = gl.getUniformLocation(this.program, "anim");
//         var topLeft = mapboxgl.MercatorCoordinate.fromLngLat({
//             lng: -180.00,
//             lat: 85
//         });
//         var topRight = mapboxgl.MercatorCoordinate.fromLngLat({
//             lng: 180,
//             lat: 85
//         });
//         var bottomLeft = mapboxgl.MercatorCoordinate.fromLngLat({
//             lng: -180.00,
//             lat: -85
//         });
//         var bottomRight = mapboxgl.MercatorCoordinate.fromLngLat({
//             lng: 180,
//             lat: -85
//         });
//         this.buffer = gl.createBuffer();
//         gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
//         gl.bufferData(
//             gl.ARRAY_BUFFER,
//             new Float32Array([
//                 topLeft.x,
//                 topLeft.y,
//                 topRight.x,
//                 topRight.y,
//                 bottomLeft.x,
//                 bottomLeft.y,
//                 bottomRight.x,
//                 bottomRight.y,
//             ]),
//             gl.STATIC_DRAW
//         );
//         this.texture = gl.createTexture();
//         const image = new Image();
//         image.src = '/texture.webp'; // 替换为你的图片地址
//         image.onload = function () {
//             console.log(image)
//             gl.bindTexture(gl.TEXTURE_2D, this.texture);
//             gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
//             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//         //     map.triggerRepaint();
//         };
//     },
//     render: function (gl, matrix) {
//         gl.useProgram(this.program);
//         gl.uniformMatrix4fv(
//             gl.getUniformLocation(this.program, 'u_matrix'),
//             false,
//             matrix
//         );
//         // animTime += 0.002;
//         // animTime = animTime % 0.2;
//         gl.uniform1f(this.unifromAnim, animTime);
//         gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
//         gl.enableVertexAttribArray(this.aPos);
//         gl.vertexAttribPointer(this.aPos, 2, gl.FLOAT, false, 0, 0);
//         gl.enable(gl.BLEND);
//         gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
//         gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
//         // mapInstance.triggerRepaint();
//         return true;
//     }
// };





let mapInstance;
export default{
        id: 'custom-image-layer',
        type: 'custom',
        renderingMode: '3d',
        onAdd: function (map, gl) {
            mapInstance = map
            gl.enable(gl.DEPTH_TEST);
            gl.depthFunc(gl.LEQUAL);
            // gl.depthMask(true);
            const vertexSource = `
                attribute vec3 a_pos;
                attribute vec2 a_texCoord;
                varying vec2 v_texCoord;
                uniform mat4 u_matrix;
                void main() {
                    gl_Position = u_matrix * vec4(a_pos, 1.0);
                    v_texCoord = a_texCoord;
                }
            `;

            const fragmentSource = `
                precision mediump float;
                varying vec2 v_texCoord;
                uniform sampler2D u_image;
                void main() {
                    vec4 color = texture2D(u_image, v_texCoord);
                    gl_FragColor = vec4(color.rgb,color.a);
                }
            `;

            const program = createProgram(gl, vertexSource, fragmentSource);

            const posBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
            let minLng = 100;
            let maxLng = 100.05;
            let minLat = 30;
            let maxLat = 30.05;

            let cenLng = (minLng+maxLng)/2;
            let cenLat = (minLat+maxLat)/2;
            let h1 = (500+mapInstance.queryTerrainElevation([cenLng,cenLat]))*mapboxgl.MercatorCoordinate.fromLngLat({lng:cenLng,lat:cenLat}).meterInMercatorCoordinateUnits();
            let h2 = (1000+mapInstance.queryTerrainElevation([cenLng,cenLat]))*mapboxgl.MercatorCoordinate.fromLngLat({lng:cenLng,lat:cenLat}).meterInMercatorCoordinateUnits();
            let h3 = (1500+mapInstance.queryTerrainElevation([cenLng,cenLat]))*mapboxgl.MercatorCoordinate.fromLngLat({lng:cenLng,lat:cenLat}).meterInMercatorCoordinateUnits();
            var topLeft = mapboxgl.MercatorCoordinate.fromLngLat({
                lng: minLng,
                lat: maxLat
            });
            var topRight = mapboxgl.MercatorCoordinate.fromLngLat({
                lng: maxLng,
                lat: maxLat
            });
            var bottomLeft = mapboxgl.MercatorCoordinate.fromLngLat({
                lng: minLng,
                lat: minLat
            });
            var bottomRight = mapboxgl.MercatorCoordinate.fromLngLat({
                lng: maxLng,
                lat: minLat
            });
            const positions = new Float32Array([
                topLeft.x, topLeft.y,h1,
                topRight.x,topRight.y,h1,
                bottomLeft.x, bottomLeft.y,h1,
                bottomRight.x, bottomRight.y,h1,
                topLeft.x, topLeft.y,h2,
                topRight.x,topRight.y,h2,
                bottomLeft.x, bottomLeft.y,h2,
                bottomRight.x, bottomRight.y,h2,
                topLeft.x, topLeft.y,h3,
                topRight.x,topRight.y,h3,
                bottomLeft.x, bottomLeft.y,h3,
                bottomRight.x, bottomRight.y,h3,
            ]);
            gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

            const texCoordBuffer = gl.createBuffer();
            gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
            const texCoords = new Float32Array([
                0, 0,
                1, 0,
                0, 1,
                1, 1,
                0, 0,
                1, 0,
                0, 1,
                1, 1,
                0, 0,
                1, 0,
                0, 1,
                1, 1,
            ]);
            gl.bufferData(gl.ARRAY_BUFFER, texCoords, gl.STATIC_DRAW);

            this.texture1 = gl.createTexture();
            const image1 = new Image();
            image1.src = '/13.png';
            image1.onload = ()=>{
                gl.bindTexture(gl.TEXTURE_2D, this.texture1);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image1);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                map.triggerRepaint();
            };
            this.texture2 = gl.createTexture();
            const image2 = new Image();
            image2.src = '/14.png';
            image2.onload = () => {
                gl.bindTexture(gl.TEXTURE_2D, this.texture2);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image2);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                map.triggerRepaint();
            };

            this.texture3 = gl.createTexture();
            const image3 = new Image();
            image3.src = '/15.png';
            image3.onload = () => {
                gl.bindTexture(gl.TEXTURE_2D, this.texture3);
                gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image3);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                map.triggerRepaint();
            };

            function createShader(gl, source, type) {
                const shader = gl.createShader(type);
                gl.shaderSource(shader, source);
                gl.compileShader(shader);
                if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                    console.error(gl.getShaderInfoLog(shader));
                    gl.deleteShader(shader);
                    return null;
                }
                return shader;
            }

            function createProgram(gl, vertexSource, fragmentSource) {
                const vertexShader = createShader(gl, vertexSource, gl.VERTEX_SHADER);
                const fragmentShader = createShader(gl, fragmentSource, gl.FRAGMENT_SHADER);
                const program = gl.createProgram();
                gl.attachShader(program, vertexShader);
                gl.attachShader(program, fragmentShader);
                gl.linkProgram(program);
                if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                    console.error(gl.getProgramInfoLog(program));
                    gl.deleteProgram(program);
                    return null;
                }
                return program;
            }
            this.program = program;
            this.posBuffer = posBuffer;
            this.texCoordBuffer = texCoordBuffer;
        },
        render: function (gl, matrix) {
            // gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
            gl.useProgram(this.program);

            const aPosLocation = gl.getAttribLocation(this.program, 'a_pos');
            gl.bindBuffer(gl.ARRAY_BUFFER, this.posBuffer);
            gl.enableVertexAttribArray(aPosLocation);
            gl.vertexAttribPointer(aPosLocation, 3, gl.FLOAT, false, 0, 0);

            const aTexCoordLocation = gl.getAttribLocation(this.program, 'a_texCoord');
            gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordBuffer);
            gl.enableVertexAttribArray(aTexCoordLocation);
            gl.vertexAttribPointer(aTexCoordLocation, 2, gl.FLOAT, false, 0, 0);

            const uMatrixLocation = gl.getUniformLocation(this.program, 'u_matrix');




            gl.uniformMatrix4fv(uMatrixLocation, false, matrix);

            const uImageLocation = gl.getUniformLocation(this.program, 'u_image');
            gl.activeTexture(gl.TEXTURE0);
            gl.uniform1i(uImageLocation, 0);

            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
            gl.bindTexture(gl.TEXTURE_2D, this.texture1);
            gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
            gl.bindTexture(gl.TEXTURE_2D, this.texture2);
            gl.drawArrays(gl.TRIANGLE_STRIP,4,4);
            gl.bindTexture(gl.TEXTURE_2D, this.texture3);
            gl.drawArrays(gl.TRIANGLE_STRIP,8,4);
            // mapInstance.triggerRepaint();
        }
}