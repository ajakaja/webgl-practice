const glm = require("gl-matrix")
const initShaders = require("./shaders/shaders.js");

const graph = require("./scenegraph.js");
const models = require("./models.js");
const mat4 = glm.mat4;
const vec3 = glm.vec3;


const renderables = [];

function translate(node, x, y, z) {
	node.localMatrix = mat4.translate(node.localMatrix, vec3.fromValues(x,y,z));
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



		const grid = new Renderable("grid", root, gridInfo, gridProgram);

		const pyramid = new Renderable("pyramid", root, pyramidInfo, polyProgram);

		const ANG_VELOCITY = 1.0; //radians
		pyramid.update = function(delta) {
			let d = ANG_VELOCITY * delta;
			rotateX(this, d);
			rotateY(this, -d);
		}.bind(pyramid);

		const pyramid2 = new Renderable("pyramid2", root, pyramidInfo, polyProgram);
		pyramid2.localMatrix = mat4.fromTranslation(mat4.create(), vec3.fromValues(2, 0, 2));
		pyramid2.update = function(delta) {
			let d = ANG_VELOCITY * delta;
			rotateX(this, -d);
			rotateY(this, d);
		}.bind(pyramid2);

		return root;
	}

}