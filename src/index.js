var domready = require("domready");
var glm = require("gl-matrix");
const mat4 = glm.mat4;
const glMatrix = glm.glMatrix;

const shaders = require("shaders.js");

domready(init);

let gl;
function init() {

	var canvas = document.getElementById("canvas", { alpha: false });
	initGL(canvas);
	shaders.initShaders(gl);
	createPrism([[0,0], [0,1], [1,1], [1,0]]);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);

	drawScene();

}

function initGL(canvas) {
	gl = canvas.getContext("webgl2");

	if (!gl) {
		throw "could not initialize GL";
	}
	return gl;
}




var buffer;
var colorBuffer;
function createPrism(p) {
	buffer = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	let p0 = p[0]
	let l = p.length;
	
	let vertices = [
		0.0, 0.0, 0.0,
		0.0, 1.0, 0.0,
		1.0, 0.0, 0.0,

		0.0, 0.0, 0.0,
		0.0, 0.0, 1.0,
		0.0, 1.0, 0.0,

		0.0, 0.0, 0.0,
		1.0, 0.0, 0.0,
		0.0, 0.0, 1.0, 

		0.0, 1.0, 0.0, 
		0.0, 0.0, 1.0,
		1.0, 0.0, 0.0

	];

	let colors = [
		150, 100, 50, 255,
		150, 100, 50, 255,
		150, 100, 50, 255,

		150, 150, 150, 255,
		150, 150, 150, 255,
		150, 150, 150, 255,

		100, 150, 150, 255,
		100, 150, 150, 255,
		100, 150, 150, 255,

		150, 100, 150, 255,
		150, 100, 150, 255,
		150, 100, 150, 255
	]


    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

	buffer.count = vertices.length / 3;

	colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);

}

var mvMatrix = mat4.create();
var pMatrix = mat4.create();
function drawScene() {




	mat4.perspective(pMatrix, glMatrix.toRadian(45), gl.drawingBufferWidth / gl.drawingBufferHeight, 0.1, 100.0);
	mat4.identity(mvMatrix);
	mat4.translate(mvMatrix, mvMatrix, [0, 0.0, -7.0]);


	gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
	var vertexLocation = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(vertexLocation);

	gl.vertexAttribPointer(vertexLocation, 3 /*triangles*/, gl.FLOAT, false, 0, 0);


	var colorAttributeLocation = gl.getAttribLocation(shaderProgram, "aColor");
	gl.enableVertexAttribArray(colorAttributeLocation);

	gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
	gl.vertexAttribPointer(colorAttributeLocation, 4, gl.UNSIGNED_BYTE, true, 0, 0);	
    gl.enable(gl.CULL_FACE);
    gl.enable(gl.DEPTH_TEST);

	requestAnimationFrame(update);


}

let last = 0;

function update(now) {
	now *= .02;
	let delta = now-last;
	last = now;
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);

	mat4.rotateX(mvMatrix, mvMatrix, glMatrix.toRadian(delta));
	mat4.rotateY(mvMatrix, mvMatrix, glMatrix.toRadian(-delta));

	var pmatrixLocation = gl.getUniformLocation(shaderProgram, "uPMatrix");
	var mvMatrixLocation = gl.getUniformLocation(shaderProgram, "uMVMatrix");
	gl.uniformMatrix4fv(pmatrixLocation, false, pMatrix);
	gl.uniformMatrix4fv(mvMatrixLocation, false, mvMatrix);

	gl.drawArrays(gl.TRIANGLES, 0, buffer.count);
	requestAnimationFrame(update);

}