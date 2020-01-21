precision highp float;

uniform vec2 uResolution;
uniform vec3 uMouse;
uniform float uTime;

uniform int rows;
uniform int cols;
uniform vec3 c;
uniform sampler2D text;
uniform bool show;

vec3 square(vec2 position, vec3 color)
{
	vec2 bl = step(vec2(0.01), position);			// Bottom left
	vec2 tr = step(vec2(0.01), 1.0 - position);		// Top right
	return color * (bl.x * bl.y * tr.x * tr.y);		// Square with black stroke
}

void main() 
{
	vec2 uv = gl_FragCoord.xy / uResolution.xy;
	vec2 grid = vec2(cols, rows);
	vec2 pos = fract(uv * grid);					// Multiply cells count
	vec2 cell = floor(uv * grid) / grid;			// Current cell coord
	cell.y = 1.0 - cell.y;							// Flip Y coord
	vec3 clr = texture2D(text, cell).rgb * c;
	vec3 sqr = show ? square(pos, clr) : clr;
	gl_FragColor = vec4(sqr, 1.0);
}