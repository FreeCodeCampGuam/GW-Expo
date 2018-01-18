/*
{
  "audio": true,
  "pixelRatio":2,
  "glslify": true
}
*/

precision mediump float;
uniform float time;
uniform vec2 resolution;
uniform sampler2D samples;
uniform sampler2D spectrum;
uniform float volume;
uniform vec2 mouse;
uniform sampler2D backbuffer;

#pragma glslify: noise    = require('glsl-noise/simplex/4d')
#pragma glslify: perlin    = require('glsl-noise/classic/4d')

const float PI = 3.14159265358979323846264338328;

float C,S;
#define rot(a) mat2(C=cos(a), S=sin(a), -S, C)
#define hash(x) fract(sin(x)*1e4)


void main() {
  vec3 c = vec3(.1,.1,.13);
  vec2 uv = gl_FragCoord.xy/resolution.x;
  float screen_ratio = resolution.x/resolution.y;
  uv += vec2(-.5, -.5/screen_ratio);
  vec2 nuv = uv;
  uv /= 2.;

  vec3 wave = texture2D(spectrum, nuv*rot(PI*.5)+.5).xyz;

  c += wave;


  gl_FragColor=vec4(c, 1);
}
