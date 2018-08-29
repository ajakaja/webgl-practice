const domready = require("domready");
const graphics = require("./graphics.js");
const input = require("./input.js");

domready(start);

const debug = console.log;

function start() {
	graphics.init();
	input.init();

	var last = 0;
	let delta;
	function tick(now) {
		now *= 0.001;
		delta = now-last;
		last = now;
		
		input.tick(delta, graphics.moveCamera);
		graphics.tick(delta);
		requestAnimationFrame(tick);
	}

	requestAnimationFrame(tick);

}