const fs = require('fs');
const twgl = require('twgl.js');

//these should be inlined by brfs. I don't think it works if we factor the prefix into a variable.
const polyVertSrc = fs.readFileSync(__dirname + "/shaders/poly.vert", 'utf8');
const polyFragSrc = fs.readFileSync(__dirname + "/shaders/poly.frag", 'utf8');
const gridVertSrc = fs.readFileSync(__dirname + "/shaders/grid.vert", 'utf8');
const gridFragSrc = fs.readFileSync(__dirname + "/shaders/grid.frag", 'utf8');
if(!polyVertSrc || !polyFragSrc || !gridVertSrc || !gridFragSrc) {
	throw "could not load shader files";
}

module.exports = function(gl) {

	let polyProgram = twgl.createProgramInfo(gl, [polyVertSrc, polyFragSrc]);
	let gridProgram = twgl.createProgramInfo(gl, [gridVertSrc, gridFragSrc]);

	return {
		polyProgram: polyProgram,
		gridProgram: gridProgram
	}
}
