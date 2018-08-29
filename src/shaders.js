const vertexShaderSrc = `#version 300 es
in vec3 position;
in vec4 aColor;

uniform mat4 uPMatrix;
uniform mat4 tMatrix;
out vec4 vColor;

void main(void) {
	gl_Position = uPMatrix * tMatrix * vec4(position, 1.0);
	vColor = aColor;
}`;

const fragmentShaderSrc = `#version 300 es
precision mediump float;
out vec4 outputColor;
in vec4 vColor;

void main(void) {
	outputColor = vec4(vColor.xyz, 1.0);
}`;

const gridVertexShaderSrc = `#version 300 es
in vec3 position;
in vec4 aColor;

uniform mat4 uPMatrix;
uniform mat4 tMatrix;
out vec2 vertex;

void main(void) {
	gl_Position = uPMatrix * tMatrix * vec4(position, 1.0);
	vertex = position.xy;
}`;

//draw white if this point is changing x- or y- integer values
const gridFragmentShaderSrc = `#version 300 es
precision mediump float;
out vec4 outputColor;
in vec2 vertex;

void main(void) {

  // Compute anti-aliased world-space grid lines
  vec2 grid = abs(fract(vertex - 0.5) - 0.5) / fwidth(vertex);
  float line = min(grid.x, grid.y);

  // Just visualize the grid lines directly
  outputColor = vec4(vec3(1.0 - min(line, 1.0)), 1.0);
}`;

module.exports = function(gl) {

	function loadShader(text, type) {
		if(type != gl.FRAGMENT_SHADER && type != gl.VERTEX_SHADER) {
			throw `unknown shader type: ${type}`;
		}
		var shader = gl.createShader(type);
		gl.shaderSource(shader, text);
		gl.compileShader(shader);
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			throw `Error compiling shader: "${gl.getShaderInfoLog(shader)}"`;
		}

		return shader;
	}

	function createProgram(vsrc, fsrc) {
		var vertexShader = loadShader(vsrc, gl.VERTEX_SHADER);
		var fragmentShader = loadShader(fsrc, gl.FRAGMENT_SHADER);

		let program = gl.createProgram();
		gl.attachShader(program, vertexShader);
		gl.attachShader(program, fragmentShader);
		gl.linkProgram(program);
		if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
			throw "could not initialize shaders";
		}
		return program;
	}

	let polyProgram = createProgram(vertexShaderSrc, fragmentShaderSrc);
	let gridProgram = createProgram(gridVertexShaderSrc, gridFragmentShaderSrc)


	return {
		polyProgram: {
			program: polyProgram,
			positionLoc: gl.getAttribLocation(polyProgram, "position"),
			colorLoc: gl.getAttribLocation(polyProgram, "aColor"),
			pmatrixLoc: gl.getUniformLocation(polyProgram, "uPMatrix"),
			tmatrixLoc: gl.getUniformLocation(polyProgram, "tMatrix"),
		},
		gridProgram: {
			program: gridProgram,
			positionLoc: gl.getAttribLocation(gridProgram, "position"),
			pmatrixLoc: gl.getUniformLocation(gridProgram, "uPMatrix"),
			tmatrixLoc: gl.getUniformLocation(gridProgram, "tMatrix"),
		}

	}
}
