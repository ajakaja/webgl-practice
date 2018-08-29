const twgl = require("twgl.js");

module.exports = {
	pyramid(gl) {
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
	},

	grid(gl) {
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
}