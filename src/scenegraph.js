const glm = require("gl-matrix")
const mat4 = glm.mat4;

const NOP = () => {};

class Node {
	constructor(name, parent) {
		this.name = name;
		this.localMatrix = mat4.create();
		this.worldMatrix = mat4.create();

		this.setParent(parent);
		this.children = [];

		this.update = NOP;
	}

	setParent(parent) {
		this.parent = parent;
		if(parent) {
			parent.children.push(this);
		}
		this.moved = true;
	}

	//cull this computation for things that are offscreen? only if the object doesn't affect others?
	computeWorldMatrix(parentMatrix, moved) {
		if(this.moved || moved) {
			mat4.multiply(this.worldMatrix, parentMatrix, this.localMatrix);
			this.moved = false;
			this.children.forEach((e) => {
				e.computeWorldMatrix(this.worldMatrix, true);
			});
		} else {
			this.children.forEach((e) => {
				e.computeWorldMatrix(this.worldMatrix, false);
			});
		}
	}

	tick(delta) {
		this.update(delta);
		//if move --> update children .moved
		this.children.forEach((e) => {
			e.tick(delta);
		});
	}
}

class Renderable extends Node {
	constructor(name, parent, bufferInfo, shaderProgram) {
		super(name, parent);
		if(!bufferInfo || !shaderProgram) { throw `error initializing Renderable(${this.name})`; }
		this.bufferInfo = bufferInfo;
		this.shaderProgram = shaderProgram;
		this.beforeRender = NOP;
		this.afterRender = NOP;
	}
}


module.exports.Node = Node;
module.exports.Renderable = Renderable;