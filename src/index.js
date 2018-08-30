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
	let delta;
	function tick(now) {
		frameCount++;
		delta = (now-last)*0.001;
		delta = Math.min(delta, 100); //so we don't skip frames when offscreen.
		last = now;
		
		input.tick(delta, graphics.moveCamera);
		scene.tick(delta);
		graphics.render(scene);
		requestAnimationFrame(tick);
	}

	requestAnimationFrame(tick);

}