const domready = require("domready");
const graphics = require("./graphics.js");
const input = require("./input.js");
const world = require("./world.js");


domready(start);

const debug = console.log;
let frameCount = 0;

function start() {
	graphics.init();
	input.init();

	const scene = world.init(graphics.gl);


	var last = 0;
	let delta_seconds;
	function tick(now) {
		frameCount++;
		delta_seconds = (now-last)*0.001;
		delta_seconds = Math.min(delta_seconds, 0.01); //so we don't skip frames when offscreen.
		last = now;
		
		input.tick(delta_seconds, graphics.moveCamera);
		scene.tick(delta_seconds);
		graphics.render(scene);
		requestAnimationFrame(tick);
	}

	requestAnimationFrame(tick);

}