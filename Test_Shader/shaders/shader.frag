precision highp float;

uniform vec2 u_resolution;
uniform vec3 u_mouse;
uniform float u_time;

uniform int rows;
uniform int cols;
uniform vec3 c;
uniform sampler2D text;

float square(vec2 position, float size)
{
	vec2 bl = step(vec2(0.01), position);
	vec2 tr = step(vec2(0.01), 1.0 - position);
	return bl.x * bl.y * tr.x * tr.y;
}

void main() 
{
	vec2 st = gl_FragCoord.st/u_resolution;
	vec2 pos = fract(st * vec2(cols, -rows));
	float sqr = square(pos, 0.5);
	gl_FragColor = vec4(c * sqr, 1.0);
	// gl_FragColor = texture2D(text, pos) * vec4(c, 1.0);
	// gl_FragColor = vec4(st, 0.0, 1.0);
}