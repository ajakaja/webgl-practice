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

		return {
			vertices: vertexBuffer,
			colors: colorBuffer,
			count: vertices.length / 3
		}
	},

	grid(gl, shader) {
		const N = 100;
		let vertices = [];
		for(let i = -N; i <= N; i++) {
			//line from (i, -10) to (i, 10);
			vertices.push(i, -N, 0, i, N, 0);
			vertices.push(-N, i, 0, N, i, 0);
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