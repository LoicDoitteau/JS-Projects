precision highp float;

uniform vec2 u_resolution;
uniform vec3 u_mouse;
uniform float u_time;

uniform vec4 viewPort;
uniform int rows;
uniform int cols;
uniform vec3 mainColor;
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

vec2 map(vec2 value, vec2 min1, vec2 max1, vec2 min2, vec2 max2)
{
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float map(float value, float min1, float max1, float min2, float max2)
{
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float luminance(vec3 color)
{
	return color.r * 0.299 + color.g * 0.587 + color.b * 0.114;
}

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
	vec2 bl = step(vec2(0.05), position);							// Bottom left
	vec2 tr = step(vec2(0.05), 1.0 - position);						// Top right
	float t = bl.x * bl.y * tr.x * tr.y;
	float coef = luminance(color) > 0.5 ? -1.0 : 1.0;
	return mix(color + vec3(1.0) * 0.4 * coef, color, t);
}

void main() 
{
	vec2 uv = gl_FragCoord.xy / u_resolution.xy;
	vec2 view = map(gl_FragCoord.xy, vec2(0.0), u_resolution, viewPort.xy, viewPort.zw) / u_resolution;
	vec2 grid = vec2(cols, rows);
	vec2 pos = fract(view * grid);					// Multiply cells count
	vec2 cell = floor(view * grid) / grid;			// Current cell coord
	vec3 clr = texture2D(mainTex, cell).rgb * mainColor;
	ditherize(clr, floor(view * grid));
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