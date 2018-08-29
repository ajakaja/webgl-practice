const glm = require("gl-matrix");
const twgl = require("twgl.js");

const initShaders = require("./shaders.js");
const models = require("./models.js");
const mat4 = glm.mat4;
const glMatrix = glm.glMatrix;

let gl, polyProgram, gridProgram, pyramidInfo, gridInfo;

var cameraMatrix = mat4.create();

function init() {
	gl = setupGl();
	let shaders = initShaders(gl);
	polyProgram = shaders.polyProgram;
	gridProgram = shaders.gridProgram;

	gl.useProgram(polyProgram.program);

	pyramidInfo = models.pyramid(gl, polyProgram);
	gridInfo = models.grid(gl, gridProgram);

	const translationMatrix = mat4.create();
	const perspectiveMatrix = mat4.create();
	const modelMatrix = mat4.create();
	const viewMatrix = mat4.create();
	const ID4 = mat4.create();
	const rad = glMatrix.toRadian(45);


	mat4.perspective(perspectiveMatrix, glMatrix.toRadian(60), gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100.0);
	mat4.translate(translationMatrix, translationMatrix, [0, 0.0, -7.0]);

	function updateCamera(pos) {
		if(!pos) {
			throw "Error: bad arguments to updateCamera([x,y,z])";
		}

		mat4.fromTranslation(cameraMatrix, pos);
		mat4.rotateX(cameraMatrix, cameraMatrix, rad)

		mat4.invert(viewMatrix, cameraMatrix);
		mat4.multiply(viewMatrix, translationMatrix, viewMatrix);
		mat4.multiply(viewMatrix, perspectiveMatrix, viewMatrix);
	}

	var cameraPos = [0.0,0.0,0.0];
	updateCamera(cameraPos);

	const uniforms = {
		perspectiveMatrix : viewMatrix,
		modelMatrix : modelMatrix,
	};

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
		gl.enable(gl.DEPTH_TEST);

		uniforms.modelMatrix = ID4; //we don't want the grid to rotate //TODO rename matrices

		gl.useProgram(gridProgram.program);

    	twgl.setUniforms(gridProgram, uniforms);
		twgl.setBuffersAndAttributes(gl, gridProgram, gridInfo); 
		twgl.drawBufferInfo(gl, gridInfo);

		gl.disable(gl.DEPTH_TEST); //???
		uniforms.modelMatrix = modelMatrix;


		d = ANG_VELOCITY * delta;
		mat4.rotateX(modelMatrix, modelMatrix, d);
		mat4.rotateY(modelMatrix, modelMatrix, -d);

		gl.useProgram(polyProgram.program);

    	twgl.setUniforms(polyProgram, uniforms);
		twgl.setBuffersAndAttributes(gl, polyProgram, pyramidInfo); 
		twgl.drawBufferInfo(gl, pyramidInfo);
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
