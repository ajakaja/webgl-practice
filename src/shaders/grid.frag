#version 300 es
precision mediump float;
out vec4 outputColor;
in vec2 vertex;

void main(void) {

  // Compute anti-aliased world-space grid lines
  vec2 grid = abs(fract(vertex - 0.5) - 0.5) / fwidth(vertex); 
  float line = min(grid.x, grid.y);

  // Just visualize the grid lines directly
  outputColor = vec4(vec3(1.0 - min(line, 1.0)), 1.0);
}