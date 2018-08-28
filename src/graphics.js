const glm = require("gl-matrix");
const initShaders = require("./shaders.js");
const models = require("./models.js");
const mat4 = glm.mat4;
const glMatrix = glm.glMatrix;

let gl, shader, pyramid, grid;

var cameraMatrix = mat4.create();

function init() {
	"use strict";
	gl = setupGl();
	shader = initShaders(gl);
	gl.useProgram(shader.program);

	pyramid = models.pyramid(gl, shader);
	grid = models.grid(gl, shader);

	var mvMatrix = mat4.create();
	const pMatrix = mat4.create();
	mat4.perspective(pMatrix, glMatrix.toRadian(80), gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100.0);
	var tMatrix = mat4.create();
	var viewProjectionMatrix = mat4.create();
	var viewMatrix =mat4.create();
	const idMatrix = mat4.create();

	mat4.translate(mvMatrix, mvMatrix, [0, 0.0, -7.0]);
	const rad30 = glMatrix.toRadian(30);

	function updateCamera(pos) {
		if(!pos) {
			throw "Error: bad arguments to updateCamera([x,y,z])";
		}

		mat4.fromTranslation(cameraMatrix, pos);
		mat4.rotateX(cameraMatrix, cameraMatrix, rad30)
		//mat4.fromXRotation(cameraMatrix, rad30);
		//mat4.translate(cameraMatrix, cameraMatrix, pos);

		mat4.invert(viewMatrix, cameraMatrix);
		mat4.multiply(viewProjectionMatrix, pMatrix, viewMatrix);
		gl.vertexAttrib3f(shader.cameraLoc, ...pos); //for fading out distance -- not working??

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

		d = ANG_VELOCITY * delta;
		mat4.rotateX(tMatrix, tMatrix, d);
		mat4.rotateY(tMatrix, tMatrix, -d);

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
		gl.vertexAttrib4f(shader.colorLoc, 1.0, 1.0, 1.0, 1.0); //constant color
		gl.uniformMatrix4fv(shader.tmatrixLoc, false, idMatrix);
		gl.drawArrays(gl.LINES, 0, grid.count);

	}

	module.exports.tick = tick;
	module.exports.moveCamera = moveCamera;

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
	gl.enable(gl.BLEND);
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
