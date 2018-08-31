const glm = require("gl-matrix");
const twgl = require("twgl.js");

const mat4 = glm.mat4;
const glMatrix = glm.glMatrix;

let gl;

var cameraMatrix = mat4.create();

function init() {
	gl = setupGl();

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
		mat4.rotateX(cameraMatrix, cameraMatrix, rad) //todo: don't invert?
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

	let programInfo, renderables;



	function render(scene) {
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
		gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

		renderables = scene.getRenderables();
		renderables.forEach(node => {
			programInfo = node.shaderProgram;
			node.beforeRender(gl);
			gl.useProgram(programInfo.program);

			uniforms.modelMatrix = node.worldMatrix;
			twgl.setUniforms(programInfo, uniforms);
			twgl.setBuffersAndAttributes(gl, programInfo, node.bufferInfo); 
			twgl.drawBufferInfo(gl, node.bufferInfo);

			node.afterRender(gl);

		});
	}

	module.exports.render = render;
	module.exports.moveCamera = moveCamera;
	module.exports.gl = gl;
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
	gl.enable(gl.BLEND);
	gl.enable(gl.DEPTH_TEST);
	gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
	return gl;
}

function initError() {
	throw "Error: GL not init()ed";
}

module.exports = {
	init: init,
	render: initError,
	moveCamera: initError
};
