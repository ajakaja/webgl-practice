const glm = require("gl-matrix");
const initShaders = require("./shaders.js");
const models = require("./models.js");
const mat4 = glm.mat4;
const glMatrix = glm.glMatrix;

let gl, shader, gridShader, pyramid, grid;

var cameraMatrix = mat4.create();

function init() {
	"use strict";
	gl = setupGl();
	let shaders = initShaders(gl);
	shader = shaders.polyProgram;
	gridShader = shaders.gridProgram;

	gl.useProgram(shader.program);

	pyramid = models.pyramid(gl, shader);
	grid = models.grid(gl, gridShader);

	var mvMatrix = mat4.create();
	const pMatrix = mat4.create();
	mat4.perspective(pMatrix, glMatrix.toRadian(60), gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100.0);
	var tMatrix = mat4.create();
	var viewMatrix =mat4.create();
	const idMatrix = mat4.create();

	mat4.translate(mvMatrix, mvMatrix, [0, 0.0, -7.0]);
	const rad = glMatrix.toRadian(45);

	function updateCamera(pos) {
		if(!pos) {
			throw "Error: bad arguments to updateCamera([x,y,z])";
		}

		mat4.fromTranslation(cameraMatrix, pos);
		mat4.rotateX(cameraMatrix, cameraMatrix, rad)

		mat4.invert(viewMatrix, cameraMatrix);
		mat4.multiply(viewMatrix, mvMatrix, viewMatrix);
		mat4.multiply(viewMatrix, pMatrix, viewMatrix);
	}

	var cameraPos = [0.0,0.0,0.0];
	updateCamera(cameraPos);

	function moveCamera(delta) {
		if(!delta || !Array.isArray(delta) || delta.length != 3) {
			throw "Error: bad arguments to moveCamera([dx,dy,dz])";
		}
		cameraPos[0] += delta[0];
		cameraPos[1] += delta[1];
		cameraPos[2] += delta[2];
		updateCamera(cameraPos);
	}

	const ANG_VELOCITY = 1.0; //radians
	let d;
	function tick(delta) {

		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

		gl.useProgram(gridShader.program);

		gl.enable(gl.DEPTH_TEST);

		gl.uniformMatrix4fv(gridShader.pmatrixLoc, false, viewMatrix);

		gl.bindBuffer(gl.ARRAY_BUFFER, grid.vertices);
		gl.vertexAttribPointer(gridShader.positionLoc, 3, gl.FLOAT, false, 0, 0);
		gl.uniformMatrix4fv(gridShader.tmatrixLoc, false, idMatrix);
		gl.drawArrays(gl.TRIANGLES, 0, grid.count);

		gl.disable(gl.DEPTH_TEST);

		gl.useProgram(shader.program);

		d = ANG_VELOCITY * delta;
		mat4.rotateX(tMatrix, tMatrix, d);
		mat4.rotateY(tMatrix, tMatrix, -d);

		gl.uniformMatrix4fv(shader.pmatrixLoc, false, viewMatrix);
		gl.uniformMatrix4fv(shader.tmatrixLoc, false, tMatrix);

		gl.bindBuffer(gl.ARRAY_BUFFER, pyramid.vertices);
		gl.enableVertexAttribArray(shader.positionLoc);
		gl.vertexAttribPointer(shader.positionLoc, 3 /*triangles*/, gl.FLOAT, false, 0, 0);

		gl.bindBuffer(gl.ARRAY_BUFFER, pyramid.colors);
		gl.enableVertexAttribArray(shader.colorLoc);
		gl.vertexAttribPointer(shader.colorLoc, 4, gl.UNSIGNED_BYTE, true, 0, 0);
		gl.drawArrays(gl.TRIANGLES, 0, pyramid.count);

	}

	module.exports.tick = tick;
	module.exports.moveCamera = moveCamera;

}

function setupGl() {
	var canvas = document.getElementById("canvas", { premultipliedAlpha: false });
	gl = canvas.getContext("webgl2", {
	   alpha: false
	});	
	if (!gl) {
		throw "could not initialize GL";
	}
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.CULL_FACE);
	return gl;
}

function initError() {
	throw "Error: GL not init()ed";
}

module.exports = {
	init: init,
	tick: initError,
	moveCamera: initError
};
