import drawVert from './shaders/draw.vert.glsl?raw';
import drawFrag from './shaders/draw.frag.glsl?raw';

import quadVert from './shaders/quad.vert.glsl?raw';

import screenFrag from './shaders/screen.frag.glsl?raw';
import updateFrag from './shaders/update.frag.glsl?raw';
import * as util from './util.js';
let LAT = Math.atan(Math.sinh(Math.PI)) * 180 / Math.PI;
export default class WindGL{
	constructor(gl,opt) {
		this.gl = gl;

		this.fadeOpacity = 0.90;// how fast the particle trails fade on each frame
		this.speedFactor = 2; // how fast the particles move
		this.dropRate = 0.003; // how often the particles move to a random place
		this.dropRateBump = 0.001; // drop rate increase relative to individual particle speed

		this.drawProgram = util.createProgram(gl, drawVert, drawFrag);
		this.screenProgram = util.createProgram(gl, quadVert, screenFrag);
		this.updateProgram = util.createProgram(gl, quadVert, updateFrag);

		this.quadBuffer = util.createBuffer(gl, new Float32Array([0, 0, 1, 0, 0, 1, 0, 1, 1, 0, 1, 1]));
		this.framebuffer = gl.createFramebuffer();
		this.boundaries = opt.boundaries || [-180,180,-LAT,LAT];


		this.defaultRampColors = {
			0.0: '#3288bd',
			0.1: '#66c2a5',
			0.2: '#abdda4',
			0.3: '#e6f598',
			0.4: '#fee08b',
			0.5: '#fdae61',
			0.6: '#f46d43',
			1.0: '#d53e4f',
		};
		this.setColorRamp(this.defaultRampColors);
		this.resize();
	}
	resize() {
		const gl = this.gl;
		const emptyPixels = new Uint8Array(gl.canvas.width * gl.canvas.height * 4);
		// screen textures to hold the drawn screen for the previous and the current frame
		this.backgroundTexture = util.createTexture(gl, gl.NEAREST, emptyPixels, gl.canvas.width, gl.canvas.height);
		this.screenTexture = util.createTexture(gl, gl.NEAREST, emptyPixels, gl.canvas.width, gl.canvas.height);
	}
	setColorRamp(colors) {
		// lookup texture for colorizing the particles according to their speed
		this.colorRampTexture = util.createTexture(this.gl, this.gl.LINEAR, getColorRamp(colors), 16, 16);
	}
	set numParticles(numParticles) {
		const gl = this.gl;

		// we create a square texture where each pixel will hold a particle position encoded as RGBA
		const particleRes = this.particleStateResolution = Math.ceil(Math.sqrt(numParticles));
		this._numParticles = particleRes * particleRes;

		const particleState = new Uint8Array(this._numParticles * 4);
		for (let i = 0; i < particleState.length; i++) {
				particleState[i] = Math.floor(Math.random() * 256); // randomize the initial particle positions
		}
		// textures to hold the particle state for the current and the next frame
		this.particleStateTexture0 = util.createTexture(gl, gl.NEAREST, particleState, particleRes, particleRes);
		this.particleStateTexture1 = util.createTexture(gl, gl.NEAREST, particleState, particleRes, particleRes);

		const particleIndices = new Float32Array(this._numParticles);
		for (let i = 0; i < this._numParticles; i++) particleIndices[i] = i;
		this.particleIndexBuffer = util.createBuffer(gl, particleIndices);
	}
	get numParticles() {
			return this._numParticles;
	}
	setWind(windData) {
		this.windData = windData;
		this.windTexture = util.createTexture(this.gl, this.gl.LINEAR, windData.image);
	}
	draw(matrix,projection) {
		const gl = this.gl;
		gl.disable(gl.DEPTH_TEST);
		gl.disable(gl.STENCIL_TEST);

		util.bindTexture(gl, this.windTexture, 0);
		util.bindTexture(gl, this.particleStateTexture0, 1);

		this.drawScreen(matrix,projection);
		this.updateParticles();
	}
	drawScreen(matrix,projection) {
		const gl = this.gl;
		// draw the screen into a temporary framebuffer to retain it as the background on the next frame
		util.bindFramebuffer(gl, this.framebuffer, this.screenTexture);
		gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

		this.drawTexture(this.backgroundTexture, this.fadeOpacity);
		this.drawParticles(matrix,projection);

		util.bindFramebuffer(gl, null);
		// enable blending to support drawing on top of an existing background (e.g. a map)
		gl.enable(gl.BLEND);
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
		this.drawTexture(this.screenTexture, 1.0);
		gl.disable(gl.BLEND);

		// save the current screen as the background for the next frame
		const temp = this.backgroundTexture;
		this.backgroundTexture = this.screenTexture;
		this.screenTexture = temp;
	}
	drawTexture(texture, opacity) {
		const gl = this.gl;
		const program = this.screenProgram;
		gl.useProgram(program.program);

		util.bindAttribute(gl, this.quadBuffer, program.a_pos, 2);
		util.bindTexture(gl, texture, 2);
		gl.uniform1i(program.u_screen, 2);
		gl.uniform1f(program.u_opacity, opacity);

		gl.drawArrays(gl.TRIANGLES, 0, 6);
	}
	drawParticles(matrix,projection) {
		const gl = this.gl;
		const program = this.drawProgram;
		gl.useProgram(program.program);

		util.bindAttribute(gl, this.particleIndexBuffer, program.a_index, 1);
		util.bindTexture(gl, this.colorRampTexture, 2);
		gl.uniformMatrix4fv(program.u_matrix, false, matrix);
		gl.uniform1i(program.projection,projection);

		gl.uniform1i(program.u_wind, 0);
		gl.uniform1i(program.u_particles, 1);
		gl.uniform1i(program.u_color_ramp, 2);

		gl.uniform1f(program.u_particles_res, this.particleStateResolution);
		gl.uniform2f(program.u_wind_min, this.windData.uMin, this.windData.vMin);
		gl.uniform2f(program.u_wind_max, this.windData.uMax, this.windData.vMax);
		gl.uniform4f(program.u_boundaries, ...this.boundaries);
		gl.drawArrays(gl.POINTS, 0, this._numParticles);
	}
	updateParticles() {
		const gl = this.gl;
		util.bindFramebuffer(gl, this.framebuffer, this.particleStateTexture1);
		gl.viewport(0, 0, this.particleStateResolution, this.particleStateResolution);

		const program = this.updateProgram;
		gl.useProgram(program.program);

		util.bindAttribute(gl, this.quadBuffer, program.a_pos, 2);

		gl.uniform1i(program.u_wind, 0);
		gl.uniform1i(program.u_particles, 1);

		gl.uniform1f(program.u_rand_seed, Math.random());
		gl.uniform2f(program.u_wind_res, this.windData.width, this.windData.height);
		gl.uniform2f(program.u_wind_min, this.windData.uMin, this.windData.vMin);
		gl.uniform2f(program.u_wind_max, this.windData.uMax, this.windData.vMax);
		gl.uniform4f(program.u_boundaries, ...this.boundaries);
		gl.uniform1f(program.u_speed_factor, this.speedFactor);
		gl.uniform1f(program.u_drop_rate, this.dropRate);
		gl.uniform1f(program.u_drop_rate_bump, this.dropRateBump);

		gl.drawArrays(gl.TRIANGLES, 0, 6);

		// swap the particle state textures so the new one becomes the current one
		const temp = this.particleStateTexture0;
		this.particleStateTexture0 = this.particleStateTexture1;
		this.particleStateTexture1 = temp;
	}
	dispose(map,gl){
		gl.deleteProgram(this.drawProgram.program)
		gl.deleteProgram(this.screenProgram.program)
		gl.deleteProgram(this.updateProgram.program)
	}
	// getSpeed(coordinate) {
	// 	if (!this.windData || !this.windData.width) {
	// 		return;
	// 	}
	// 	var t = coordinate.x % 180;
	// 	var pixelX = ((t + 180) / 360) * this.windData.width;

	// 	if (coordinate.y < -90 || coordinate.y > 90) {
	// 		throw new Error('Invalid y for coordinate');
	// 	}

	// 	var pixelY = ((90 - coordinate.y) / 180) * this.windData.height;

	// 	// make a framebuffer
	// 	let fb = this.gl.createFramebuffer();

	// 	// make this the current frame buffer
	// 	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb);

	// 	// attach the texture to the framebuffer.
	// 	this.gl.framebufferTexture2D(
	// 		this.gl.FRAMEBUFFER,
	// 		this.gl.COLOR_ATTACHMENT0,
	// 		this.gl.TEXTURE_2D,
	// 		this.windTexture,
	// 		0
	// 	);

	// 	// check if you can read from this type of texture.
	// 	let canRead = this.gl.checkFramebufferStatus(this.gl.FRAMEBUFFER) == this.gl.FRAMEBUFFER_COMPLETE;

	// 	// Unbind the framebuffer
	// 	this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
	// 	if (canRead) {
	// 		// bind the framebuffer
	// 		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, fb);
	// 		// var pixels = new Uint8Array(this.gl.drawingBufferWidth * this.gl.drawingBufferHeight * 4);
	// 		// console.log(this.gl.drawingBufferWidth,this.gl.drawingBufferHeight )
	// 		var pixels = new Uint8Array(this.windData.width * this.windData.height * 4);
	// 		this.gl.readPixels(
	// 			0,
	// 			0,
	// 			this.windData.width,
	// 			this.windData.height,
	// 			this.gl.RGBA,
	// 			this.gl.UNSIGNED_BYTE,
	// 			pixels
	// 		);

	// 		// console.log(pixels);
	// 		this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
	// 		let intX = Math.floor(pixelX);
	// 		let intY = Math.floor(pixelY);

	// 		let index0 = intY * this.windData.width * 4 + intX * 4;

	// 		// console.log(pixels[index0]);
	// 		// console.log(pixels[index0 + 1]);
	// 		// console.log(pixels[index0 + 2]);
	// 		// console.log(pixels[index0 + 3]);
	// 		var vx = (pixels[index0] * (this.windData.uMax - this.windData.uMin)) / 255 + this.windData.uMin;
	// 		var vy = (pixels[index0 + 1] * (this.windData.vMax - this.windData.vMin)) / 255 + this.windData.vMin;
	// 		return [vx, vy];
	// 	}
	// 	//
	// }
}
function getColorRamp(colors) {
	var canvas = document.createElement('canvas');
	var ctx = canvas.getContext('2d');

	canvas.width = 256;
	canvas.height = 1;

	var gradient = ctx.createLinearGradient(0, 0, 256, 0);
	for (var stop in colors) {
		gradient.addColorStop(+stop, colors[stop]);
	}
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, 256, 1);

	return new Uint8Array(ctx.getImageData(0, 0, 256, 1).data);
}