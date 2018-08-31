const twgl = require("twgl.js");

const construction = require("./construction.js");

function flatten(array) {
	return array.reduce((arr, e) => arr.concat(e), []);
}

function pyramid(gl) {
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
	];

	return twgl.createBufferInfoFromArrays(gl, {
		a_position: { numComponents: 3, data: vertices },
		a_color: { numComponents: 4, data: colors, type: Uint8Array }
	});
}

function grid(gl) {
	const N = 50;

	let vertices = [
		-N, -N, 0, 
		N, -N, 0, 
		N, N, 0,

		-N, -N, 0,
		N, N, 0,
		-N, N, 0
	];

	return twgl.createBufferInfoFromArrays(gl, {
		a_position: {numComponents: 3, data: vertices}
	});
}

function cube(gl) {
	let cubeData = construction.cube;

	let cube = {
		a_position: { numComponents: 3, data: cubeData.vertices },
		a_normals: { numComponents: 3, data: cubeData.normals },
		a_color: { numComponents: 4, data: cubeData.colors }
	};

	return twgl.createBufferInfoFromArrays(gl, cube);
}

module.exports = {
	pyramid: pyramid,
	grid: grid,
	cube: cube
}