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

	const vertexShaderSrc = `#version 300 es
	in vec3 aVertexPosition;
	in vec4 aColor;
	in vec3 cameraPosition;

	uniform mat4 uMVMatrix;
	uniform mat4 uPMatrix;
	uniform mat4 tMatrix;
	out vec4 vColor;
	out float brightness;

	void main(void) {
		gl_Position = uPMatrix * uMVMatrix * tMatrix * vec4(aVertexPosition, 1.0);
		vColor = aColor;
		brightness = 1.0/ clamp(dot(cameraPosition - aVertexPosition, cameraPosition - aVertexPosition), 0.5, 10.0);
	}`;

	const fragmentShaderSrc = `#version 300 es
	precision mediump float;
	out vec4 outputColor;
	in vec4 vColor;
	in float brightness;

	void main(void) {
		outputColor = vec4(vColor.xyz, 1.0);
	}`;
	
	var fragmentShader = loadShader(fragmentShaderSrc, gl.FRAGMENT_SHADER);
	var vertexShader = loadShader(vertexShaderSrc, gl.VERTEX_SHADER);

	program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);

	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		throw "could not initialize shaders";
	}

	return {
		program: program,
		positionLoc:  gl.getAttribLocation(program, "aVertexPosition"),
		colorLoc: gl.getAttribLocation(program, "aColor"),
		pmatrixLoc: gl.getUniformLocation(program, "uPMatrix"),
		mvmatrixLoc: gl.getUniformLocation(program, "uMVMatrix"),
		tmatrixLoc: gl.getUniformLocation(program, "tMatrix"),
		cameraLoc: gl.getAttribLocation(program, "cameraPosition")
	}
}
