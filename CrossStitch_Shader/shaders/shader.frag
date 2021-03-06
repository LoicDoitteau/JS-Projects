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
uniform int filterSize;
uniform float offset;
uniform float gamma;
uniform float treshold;
uniform float shades;
uniform float brightness;
uniform float saturation;
uniform float contrast;

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
const int matrixSize = 8;
const int matrixLength = 64;

// const int[] matrix = int[]
// (
//     0,  2,
//     3,  1
// );
// const int matrixSize = 2;
// const int matrixLength = 4;

// const int[] matrix = int[]
// (
//     0,  8,  2,  10,
//     12, 4,  14, 6,
//     3,  11, 1,  9,
//     15, 7,  13, 5
// );
// const int matrixSize = 4;
// const int matrixLength = 16;

const mat3 rgb2yuv = mat3
(
    0.299, 		0.587, 		0.114,
    -0.14713,	-0.28886, 	0.436,
    0.615, 		-0.51499, 	-0.10001
);

vec3 rgb2hsv(vec3 c)
{
    vec4 k = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
    vec4 p = c.g < c.b ? vec4(c.bg, k.wz) : vec4(c.gb, k.xy);
    vec4 q = c.r < p.x ? vec4(p.xyw, c.r) : vec4(c.r, p.yzx);
    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec2 map(vec2 value, vec2 min1, vec2 max1, vec2 min2, vec2 max2)
{
  return min2 + (value - min1) * (max2 - min2) / (max1 - min1);
}

float luminance(vec3 color)
{
	return dot(color, vec3(0.299, 0.587, 0.114));
}

vec3 texel(sampler2D sampler, vec2 pos, vec2 resolution)
{
    return pow(texture2D(sampler, pos / resolution).rgb, vec3(gamma));
}

vec3 paletteAaverage()
{
    vec3 sum = vec3(0);
    
    for(int i = 0; i < count; i++)
	{
		vec2 brush = vec2(float(i) / float(count), 0.0);
		vec3 plt = texel(palette, vec2(float(i), 0), vec2(float(count), 0));
        sum += plt;
    }
    
    return sum / float(count);
}

vec3 paletteDeviation()
{
    vec3 sum = vec3(0);
    vec3 avg = paletteAaverage();
    
    for(int i = 0; i < count; i++)
	{
		vec2 brush = vec2(float(i) / float(count), 0.0);
		vec3 plt = texel(palette, vec2(float(i), 0), vec2(float(count), 0));
        sum += abs(plt - avg);
    }
    
    return sum / float(count);
}

vec3 average(sampler2D sampler, vec2 pos, vec2 resolution)
{
    vec3 col = vec3(0);
    
    if(filterSize <= 0)
    {
        col = texel(sampler, pos, resolution);
    }
    else
    {
        for(int y = -filterSize; y <= filterSize; y++)
        {
            for(int x = -filterSize; x <= filterSize; x++)
            {
                col += texel(sampler, pos + vec2(x, y), resolution);
            }
        }
    }
    
    return col / float((2 * filterSize + 1) * (2 * filterSize + 1));
}

float sobel(sampler2D sampler, vec2 pos, vec2 resolution)
{
    float gx = luminance
        (
            -1.0 * texel(sampler, pos + vec2(-1.0, -1.0) * offset, resolution) +
            -2.0 * texel(sampler, pos + vec2(-1.0,  0.0) * offset, resolution) +
            -1.0 * texel(sampler, pos + vec2(-1.0,  1.0) * offset, resolution) +
             1.0 * texel(sampler, pos + vec2( 1.0, -1.0) * offset, resolution) +
             2.0 * texel(sampler, pos + vec2( 1.0,  0.0) * offset, resolution) +
             1.0 * texel(sampler, pos + vec2( 1.0,  1.0) * offset, resolution)
        );
    float gy = luminance
        (
            -1.0 * texel(sampler, pos + vec2(-1.0, -1.0) * offset, resolution) +
            -2.0 * texel(sampler, pos + vec2( 0.0, -1.0) * offset, resolution) +
            -1.0 * texel(sampler, pos + vec2( 1.0, -1.0) * offset, resolution) +
             1.0 * texel(sampler, pos + vec2(-1.0,  1.0) * offset, resolution) +
             2.0 * texel(sampler, pos + vec2( 0.0,  1.0) * offset, resolution) +
             1.0 * texel(sampler, pos + vec2( 1.0,  1.0) * offset, resolution)
        );
    return sqrt(gx * gx + gy * gy);
}

float squaredDistance(vec3 point1, vec3 point2)
{
	vec3 distanceVector = point2 - point1;
	return dot(distanceVector, distanceVector);
}

void quantize(inout vec3 color)
{
	vec3 closest = vec3(0.0, 0.0, 0.0);
	float minDist = 999.0;

	for(int i = 0; i < count; i++)
	{
		vec2 brush = vec2(float(i) / float(count), 0.0);
		vec3 plt = texel(palette, vec2(float(i), 0), vec2(float(count), 0));
		float dist = squaredDistance(color * rgb2yuv, plt * rgb2yuv);
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
	int index = int(mod(position.x, float(matrixSize))) + int(mod(position.y, float(matrixSize))) * matrixSize;
	float offset = (float(matrix[index]) + 1.0) / float(matrixLength) - 0.5;
	color += offset * bias;// * paletteDeviation(); 
	quantize(color);
}

void _brighten(inout vec3 color)
{
    color = clamp(color + brightness, 0.0, 1.0);
}

void _saturate(inout vec3 color)
{
    vec3 grey = vec3(luminance(color));
    color = clamp(mix(grey, color, saturation), 0.0, 1.0);
}

void _contrast(inout vec3 color)
{
    float t =  (1.0 - contrast) * 0.5;
    color = clamp(color * contrast + t, 0.0, 1.0);
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
    vec3 clr = average(mainTex, cell * u_resolution, u_resolution) * mainColor;
	clr = hsv2rgb(floor(rgb2hsv(clr) * shades) / shades);    
    _brighten(clr);
    _contrast(clr);
    _saturate(clr);
    float t = sobel(mainTex, cell * u_resolution, u_resolution);
    clr = mix(clr, vec3(0), smoothstep(treshold - 0.15, treshold + 0.15, t));
	ditherize(clr, floor(view * grid));
	vec3 sqr = show ? square(clr, pos) : clr;
	sqr = pow(sqr, vec3(1.0 / gamma));
	gl_FragColor = vec4(sqr, 1.0);

	if(show)
	{
		vec2 brush = vec2(floor(uv.x * float(count)) / float(count), 0.0);
		vec4 plt = texture2D(palette, brush);
		float val = step(0.98, uv.y);
		gl_FragColor = mix(gl_FragColor, plt, val);
	}
}