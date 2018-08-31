const glm = require("gl-matrix")
const initShaders = require("./shaders/shaders.js");
const Scene = require("./scene.js");
const graph = require("./scenegraph.js");
const models = require("./assets/models.js");
const mat4 = glm.mat4;
const vec3 = glm.vec3;


const renderables = [];

function translate(node, x, y, z) {
	node.localMatrix = mat4.translate(node.localMatrix, node.localMatrix, vec3.fromValues(x,y,z));
	node.moved = true;
}

function rotateX(node, ang) {
	node.localMatrix = mat4.rotateX(node.localMatrix, node.localMatrix, ang);
	node.moved = true;
}

function rotateY(node, ang) {
	node.localMatrix = mat4.rotateY(node.localMatrix, node.localMatrix, ang);
	node.moved = true;
}

function rotateZ(node, ang) {
	node.localMatrix = mat4.rotateZ(node.localMatrix, node.localMatrix, ang);
	node.moved = true;
}

module.exports = {
	init: function(gl) {
		let Node = graph.Node;
		let Renderable = graph.Renderable;


		let shaders = initShaders(gl);
		let polyProgram = shaders.polyProgram;
		let gridProgram = shaders.gridProgram;

		const root = new Node("root", null);

		const gridInfo = models.grid(gl);
		const pyramidInfo = models.pyramid(gl);
		const cubeInfo = models.cube(gl);
		const pyramid = new Renderable("pyramid", root, pyramidInfo, polyProgram);

		translate(pyramid, 2.5, 2, 0);

		const ANG_VELOCITY = 1.0; //radians
		pyramid.update = function(delta) {
			let d = ANG_VELOCITY * delta;
			rotateX(this, d);
			rotateY(this, -d);

		}.bind(pyramid);

		const pyramid2 = new Renderable("pyramid2", root, pyramidInfo, polyProgram);
		translate(pyramid2, 0, 2, 0);
		pyramid2.update = function(delta) {
			let d = ANG_VELOCITY * delta / 2;
			rotateZ(this, d);
		}.bind(pyramid2);

		let cube = new Renderable("cube", root, cubeInfo, polyProgram);
		translate(cube, -0.5,-0.5,-0.5);
		cube.beforeRender = (gl) => {
			// gl.disableVertexAttribArray(polyProgram.attribSetters.a_color.location);
			// gl.vertexAttrib4f(polyProgram.attribSetters.a_color.location, 0.8, 0.5, 0.8, 1.0);
		}

		const grid = new Renderable("grid", root, gridInfo, gridProgram);
		//grid.afterRender = (gl) => gl.clear(gl.DEPTH_BUFFER_BIT);

		return new Scene(root);
	}

}