const glm = require("gl-matrix");
const mat4 = glm.mat4;

function getRenderablesRecursive(node, ret) {
	if(node.bufferInfo) {
		ret.push(node);
	}
	node.children.forEach((e) => getRenderablesRecursive(e, ret));
}

const ID4 = mat4.create();


class Scene {

	constructor(root) {
		this.renderables = [];
		this.root = root;
		getRenderablesRecursive(root, this.renderables);

		//keep elements with the same shader together.
		const sortFn = (a,b) => a.shaderProgram.ORDER - b.shaderProgram.ORDER ;
		this.renderables.sort(sortFn);
	}


	getRenderables() {
		return this.renderables; //nb: currently graphics.js sorts this in place by shader type
	}

	tick(delta) {
		this.root.tick(delta);
		this.root.computeWorldMatrix(ID4);
	}
}

module.exports = Scene;