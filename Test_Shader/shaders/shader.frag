precision highp float;
varying vec2 vPos;

uniform vec3 c;

void main() 
{
	gl_FragColor = vec4(c,1.0);
}