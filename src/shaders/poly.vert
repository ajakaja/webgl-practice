#version 300 es
in vec3 a_position;
in vec4 a_color;
in vec3 a_normal;

uniform mat4 perspectiveMatrix;
uniform mat4 modelMatrix; //model matrix

flat out vec4 v_color;

void main(void) {
	gl_Position = perspectiveMatrix * modelMatrix * vec4(a_position, 1.0);
	v_color = a_color;
}