#version 300 es
in vec3 a_position;

uniform mat4 perspectiveMatrix;
uniform mat4 modelMatrix;
out vec2 vertex;

void main(void) {
	gl_Position = perspectiveMatrix * modelMatrix * vec4(a_position, 1.0);
	vertex = a_position.xy;
}