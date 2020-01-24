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
uniform float bias;

const int[] matrix = int[]
(
	0,  48, 12, 60, 3,  51, 15, 63,
    32, 16, 44, 28, 35, 19, 47, 31,
    8,  56, 4,  52, 11, 59, 7,  55,
    40, 24, 36, 20, 43, 27, 39, 23,
    2,  50, 14, 62, 1,  49, 13, 61,
    34, 18, 46, 30, 33, 17, 45, 29,
    10, 58, 6,  54, 9,  57, 5,  53,
    42, 26, 38, 22, 41, 25, 37, 21
);

float squaredDistance(vec3 point1, vec3 point2)
{
	vec3 distanceVector = point2 - point1;
	return dot(distanceVector, distanceVector);
}

void quantize(inout vec3 color)
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

	color = closest;
}

void ditherize(inout vec3 color, vec2 position)
{
	int index = int(mod(position.x, 8.0)) + int(mod(position.y, 8.0)) * 8;
	float offset = (float(matrix[index]) + 1.0) / 64.0 - 0.5;
	color += offset * bias; 
	quantize(color);
}

vec3 square(vec3 color, vec2 position)
{
	vec2 bl = step(vec2(0.1), position);							// Bottom left
	vec2 tr = step(vec2(0.1), 1.0 - position);						// Top right
	float f = 1.0 - ((1.0 - (bl.x * bl.y * tr.x * tr.y)) * 0.1);	// Square with darker stroke
	return color * f;
}

void main() 
{
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
	vec2 grid = vec2(cols, rows);
	vec2 pos = fract(uv * grid);					// Multiply cells count
	vec2 cell = floor(uv * grid) / grid;			// Current cell coord
	vec3 clr = texture2D(mainTex, cell).rgb * color;
	ditherize(clr, floor(uv * grid));
	vec3 sqr = show ? square(clr, pos) : clr;
	gl_FragColor = vec4(sqr, 1.0);

	if(show)
	{
		vec2 brush = vec2(floor(uv.x * float(count)) / float(count), 0.0);
		vec4 plt = texture2D(palette, brush);
		float val = step(0.98, uv.y);
		gl_FragColor = mix(gl_FragColor, plt, val);
	}
}