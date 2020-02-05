precision highp float;

uniform vec2 u_resolution;
uniform vec3 u_mouse;
uniform float u_time;

uniform vec4 viewPort;
uniform vec3 mainColor;
uniform sampler2D mainTex;
uniform sampler2D matTex;
uniform int size;
uniform vec2 matRes;


float luminance(vec3 color)
{
	return color.r * 0.299 + color.g * 0.587 + color.b * 0.114;
}

float squaredDistance(float value1, float value2)
{
	float distance = value2 - value1;
	return distance * distance;
}

float hash(vec2 pos)
{
	return fract(sin(dot(pos, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() 
{
	vec2 unit = matRes / vec2(float(size), 1.0);
	vec2 uv = floor(gl_FragCoord.xy / unit) * unit / u_resolution.xy;
	vec3 clr = texture2D(mainTex, uv).rgb;
	// int index = int(floor(hash(floor(gl_FragCoord.xy / unit)) * 8.0));
	float lum = luminance(clr);
	int index = int(floor(lum * 8.0));
	// int resx = int(unit.x); 
	// int resy = int(unit.y);
	// for(int x = 0; x < resx; x++)
	// {
	// 	for(int y = 0; y < resy; y++)
	// 	{
	// 	}
	// }
	vec2 pos = mod(gl_FragCoord.xy, unit) / matRes + vec2(float(index) / float(size), 0.0);
	clr = texture2D(matTex, pos).rgb * mainColor;

	gl_FragColor = vec4(clr, 1.0);
}