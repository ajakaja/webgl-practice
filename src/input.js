
const LEFT = 'ArrowLeft';
const UP = 'ArrowUp';
const RIGHT= 'ArrowRight';
const DOWN = 'ArrowDown';

const VELOCITY = 2.0;
const direction = [0.0,0.0,0.0];

function init() {

	const listen = (el, e, fn) => { el.addEventListener(e, fn); };	
	var body = document.body;

	listen(body, 'keydown', (e) => {
		const key = e.key;
		switch(key) {
			case UP:    direction[1] = +1.0; break;
			case DOWN:  direction[1] = -1.0; break;
			case RIGHT: direction[0] = +1.0; break;
			case LEFT:  direction[0] = -1.0; break;
		}
		return false;
	});

	listen(body, 'keyup', (e) => {
		const key = e.key;
		switch(key) {
			case UP:    direction[1] = 0.0; break;
			case DOWN:  direction[1] = 0.0; break;
			case RIGHT: direction[0] = 0.0; break;
			case LEFT:  direction[0] = 0.0; break;
		}
		return false;
	});

	function tick(delta, moveFn) {

		let d = VELOCITY*delta;
		moveFn([direction[0]*d, direction[1]*d, direction[2]*d]);
	}

	module.exports.tick = tick;
}

module.exports = {
	init: init,
	tick: () => { throw "input not init()ed" }
};