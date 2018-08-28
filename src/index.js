const domready = require("domready");
const glm = require("gl-matrix");
const initShaders = require("./shaders.js");
const models = require("./models.js");

const mat4 = glm.mat4;
const glMatrix = glm.glMatrix;

domready(init);

let gl, shader, pyramid, grid;

function init() {
	"use strict";
	gl = setupGl();
	shader = initShaders(gl);
	gl.useProgram(shader.program);

	pyramid = models.pyramid(gl, shader);
	grid = models.grid(gl, shader);

	var mvMatrix = mat4.create();
	var pMatrix = mat4.create();
	var tMatrix = mat4.create();
	var viewProjectionMatrix = mat4.create();
	var cameraMatrix = mat4.create();
	var viewMatrix =mat4.create();

	mat4.perspective(pMatrix, glMatrix.toRadian(80), gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100.0);
	mat4.translate(mvMatrix, mvMatrix, [0, 0.0, -7.0]);

	mat4.fromXRotation(cameraMatrix, glMatrix.toRadian(30));
	mat4.translate(cameraMatrix, cameraMatrix, [0.0,-3.0, 0]);
	mat4.invert(viewMatrix, cameraMatrix);
	mat4.multiply(viewProjectionMatrix, pMatrix, viewMatrix);

	const idMatrix = mat4.create();




	var last = 0;
	function update(now) {
		now *= .04;
		let delta = now-last;
		last = now;
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

		mat4.rotateX(tMatrix, tMatrix, glMatrix.toRadian(delta));
		mat4.rotateY(tMatrix, tMatrix, glMatrix.toRadian(-delta));

		gl.uniformMatrix4fv(shader.pmatrixLoc, false, viewProjectionMatrix);
		gl.uniformMatrix4fv(shader.mvmatrixLoc, false, mvMatrix);
		gl.uniformMatrix4fv(shader.tmatrixLoc, false, tMatrix);

		gl.bindBuffer(gl.ARRAY_BUFFER, pyramid.vertices);
		gl.enableVertexAttribArray(shader.positionLoc);
		gl.vertexAttribPointer(shader.positionLoc, 3 /*triangles*/, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, pyramid.colors);
		gl.enableVertexAttribArray(shader.colorLoc);
		gl.vertexAttribPointer(shader.colorLoc, 4, gl.UNSIGNED_BYTE, true, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, pyramid.count);


		gl.bindBuffer(gl.ARRAY_BUFFER, grid.vertices);
		gl.vertexAttribPointer(shader.positionLoc, 3, gl.FLOAT, false, 0, 0);
		gl.disableVertexAttribArray(shader.colorLoc);
		gl.vertexAttrib4f(shader.colorLoc, 0.8, 0.8, 0.8, 1.0); //constant color
		gl.uniformMatrix4fv(shader.tmatrixLoc, false, idMatrix);
		gl.drawArrays(gl.LINES, 0, grid.count);

		if(gl.getErrors() != null) {
			console.log(`GL error ${gl.getErrors()}`);
		}

		requestAnimationFrame(update);

	}

	requestAnimationFrame(update);
}

function setupGl() {
	var canvas = document.getElementById("canvas", { alpha: false });
	gl = canvas.getContext("webgl2");
	if (!gl) {
		throw "could not initialize GL";
	}
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.CULL_FACE);
	gl.enable(gl.DEPTH_TEST);
	return gl;
}