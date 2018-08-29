#version 300 es
precision mediump float;
out vec4 outputColor;
in vec4 v_color;

void main(void) {
	outputColor = vec4(v_color.xyz, 1.0);
}