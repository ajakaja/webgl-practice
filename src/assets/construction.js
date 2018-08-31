function wedge(v1, v2, v3) {
	let s1 = subtract(v2, v1);
	let s2 = subtract(v3, v1);
	return  [s1[1] * s2[2] - s1[2] * s2[1], 
			 s1[2] * s2[0] - s1[0] * s2[2], 
			 s1[0] * s2[1] - s1[1] * s2[0]];
}

function add(v1, v2) {
	return [v1[0] + v2[0], v1[1] + v2[1], v1[2] + v2[2]];
}

function subtract(v1, v2) {
	return [v1[0] - v2[0], v1[1] - v2[1], v1[2] - v2[2]];
}

function dot(v1, v2) {
	return v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
}

function norm(v) {
	return Math.sqrt(dot(v,v));
}

function scale(v, c) {
	return [v[0] * c, v[1] * c, v[2] * c];
}

function repeat(times, f) {
	for(let i = 0; i < times; i++) {
		f();
	}
}

class Vertex {
	constructor(name, value) {
		this.name = name;
		this.value = value;
	}
}

class Face {
	constructor(vertices) {
		if(vertices.length < 3) {
			throw `error`;
		}
		this.vertices = vertices;
	}

	color(color) {
		this.color = color;
	}

	normal() {
		let w = wedge(this.vertices[0], this.vertices[1], this.vertices[2]);
		return scale(w, 1.0/norm(w));
	}

	areaVector() {
		let area = [0,0,0];
		for(let i = 1; i < this.vertices.length - 1; i++) {
			area = add(area, wedge(this.vertices[0], this.vertices[i], this.vertices[i+1]));
		}
		return area;
	}

	asTriangles() {
		const vertices = []; 
		for(let i = 1; i < this.vertices.length - 1; i ++) {
			vertices.push(...this.vertices[0], ...this.vertices[i], ...this.vertices[i+1]);
		}
		return vertices;
	}
}

class Figure {
	constructor(name) {
		this.name = name;
		this.faces = [];
	}

	face(...vertices) {
		let face = new Face(vertices.map(v => v.value));
		this.faces.push(face);
		return face;
	}

	areaVector() {
		let v = [0, 0, 0];
		this.faces.forEach(face => {
			v = add(v, face.areaVector());
		});
		return v;
	}

	/*
		Build vertex + normal buffers for a NON-indexed figure

		nb: if using indices (element array buffer), a vertex has the same attributes every time it's used. So you either can't store normals and colors per-vertex, or you have to duplicate vertices, and then what's the point?

		Basically: indexing is for _smooth_ objects, with curved surfaces, so the normals _at a vertex_ are important, rather than the normals on a face.
	*/

	build() {
		let areaVector = this.areaVector();
		if(norm(areaVector) > 0.0001) {
			console.log(`WARNING: figure "${this.name}" is not closed; area vector is (${areaVector}).`);
		}

		const vertices = []; 
		const normals = [];
		const colors = [];
		this.faces.forEach(face => {
			let triangles = face.asTriangles();
			let normal = face.normal();
			vertices.push(...triangles);
			repeat(triangles.length/3, () => normals.push(...normal));
			if(face.color) {
				repeat(triangles.length/3, () => colors.push(...face.color));
			}
		});
		return {
			vertices: vertices,
			normals: normals,
			colors: colors
		}
	}
}



const A = new Vertex("A", [0,0,0]);
const B = new Vertex("B", [0,1,0]);
const C = new Vertex("C", [1,1,0]);
const D = new Vertex("D", [1,0,0]);
const E = new Vertex("E", [0,0,1]);
const F = new Vertex("F", [0,1,1]);
const G = new Vertex("G", [1,1,1]);
const H = new Vertex("H", [1,0,1]);

const vertices = [A,B,C,D,E,F,G,H];

const red = [1.0, 0.2, 0.2, 1.0];
const green = [0.2, 1.0, 0.2, 1.0];
const blue = [0.2, 0.2, 1.0, 1.0];

let cube = new Figure("Cube");
cube.face(A,B,C,D).color(blue);
cube.face(D,C,G,H).color(red)
cube.face(C,B,F,G).color(green);
cube.face(B,A,E,F).color(red);
cube.face(A,D,H,E).color(blue);
cube.face(G,F,E,H).color(green);
let cubeData = cube.build();

console.log(cubeData);

module.exports = {
	cube: cubeData
}