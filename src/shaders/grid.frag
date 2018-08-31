#version 300 es
precision mediump float;
out vec4 outputColor;
in vec2 vertex;
in float w;

void main(void) {

	/*
	Compute anti-aliased world-space grid lines. 

	The first part maps [x -> x+1] to [0 -> 0.5 -> 0]
	fwidth(vertex) = abs(d vertex.x) + abs(d vertex.y)
	(if 1/fwidth is replaced with a constant, like *30.0, lines in front area fat while lines in the distance are thin)
	by dividing by fwidth, the value changes the same speed _per pixel_ everywhere on screen (since it is already linear in vertex)
	ie: s.x = c*v.x; v.x/(dv.x/ds.x) = cv.x 
	*/
	vec2 grid = abs(fract(vertex - 0.5) - 0.5) / fwidth(vertex) ; 
	float line = min(grid.x, grid.y);

	// Just visualize the grid lines directly. todo: get it right with layering on other things?
	//no obvious way to get this to work, where objects can occlude grid lines but grid lines layer over objects.
	//being occluded requires depth buffer, but then the spaces between grid lines occlude other things!
	//we'd like to be occluded but not occlude
	outputColor = vec4(vec3(1.0 - min(line, 1.0)), max(ceil(1.0-line)-0.5, 0.0));

}