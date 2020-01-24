precision highp float;

uniform vec2 u_resolution;
uniform vec3 u_mouse;
uniform float u_time;

uniform int rows;
uniform int cols;
uniform vec3 color;
uniform sampler2D mainTex;
uniform sampler2D palette;
uniform int count;
uniform bool show;

float squaredDistance(vec3 point1, vec3 point2)
{
	vec3 distanceVector = point2 - point1;
	return dot(distanceVector, distanceVector);
}

vec3 closestColor(vec3 color)
{
	vec3 closest = vec3(0.0, 0.0, 0.0);
	float minDist = 2.0;

	for(int i = 0; i < count; i++)
	{
		vec2 brush = vec2(float(i) / float(count), 0.0);
		vec4 plt = texture2D(palette, brush);
		float dist = squaredDistance(color, plt.rgb);
		if(dist < minDist) 
		{
			minDist = dist;
			closest = plt.rgb;
		}
	}

	return closest;
}

vec3 square(vec2 position, vec3 color)
{
	vec2 bl = step(vec2(0.1), position);			// Bottom left
	vec2 tr = step(vec2(0.1), 1.0 - position);		// Top right
	return color * (bl.x * bl.y * tr.x * tr.y);		// Square with black stroke
}

void main() 
{
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
	vec2 grid = vec2(cols, rows);
	vec2 pos = fract(uv * grid);					// Multiply cells count
	vec2 cell = floor(uv * grid) / grid;			// Current cell coord
	vec3 clr = texture2D(mainTex, cell).rgb * color;
	clr = closestColor(clr);
	vec3 sqr = show ? square(pos, clr) : clr;
	gl_FragColor = vec4(sqr, 1.0);

	if(show)
	{
		vec2 brush = vec2(floor(uv.x * float(count)) / float(count), 0.0);
		vec4 plt = texture2D(palette, brush);
		float val = step(0.98, uv.y);
		gl_FragColor = mix(gl_FragColor, plt, val);
	}
}