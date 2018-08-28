module.exports = {
	pyramid(gl, shader) {
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

		let vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

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

		let colorBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Uint8Array(colors), gl.STATIC_DRAW);
		// let vao = gl.createVertexArray();
		// gl.bindVertexArray(vao);

		// gl.enableVertexAttributeArray();
		return {
			vertices: vertexBuffer,
			colors: colorBuffer,
			count: vertices.length / 3
		}
	},

	grid(gl, shader) {

		let vertices = [];
		for(let i = -10; i <= 10; i++) {
			//line from (i, -10) to (i, 10);
			vertices.push(i, -10, 0, i, 10, 0);
			vertices.push(-10, i, 0, 10, i, 0);
		}

		let vertexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

		return {
			vertices: vertexBuffer,
			count: vertices.length / 3
		};
	}
}