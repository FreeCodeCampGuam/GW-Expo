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

  float cs = .4;
  cs *= sin(time)*cs+cs;
  nuv *= rot(time/2.+volume/29.);
  float sz = cs*volume/22.;
  nuv.x = mod(nuv.x+sz/2., sz)-sz/2.;

  float theta = atan(uv.x,uv.y);

  vec3 wave = texture2D(spectrum, nuv*rot(PI*.5)+.5).xyz;
  vec3 wave2 = texture2D(spectrum, (uv+.5)/20.).xyz;

  float pn = perlin(vec4(uv*3.*theta*atan(uv.x,uv.y-.5), time/20., wave2.x*3.));


  float circ = float(length(nuv*pn) -cs*volume/40.>0.);
  float circ2 = float(length(nuv) -(cs/2.)*volume/40.>0.);

  c.r += step(.8, fract(uv.x*20. + pn)) * theta;
  c.b -= step(.5,fract(uv.x*20. -pn));

  c.rg *= rot(time/2.);
  c.gb *= rot(time/3.);

  c = vec3(length(c));

  c -= 1./(circ-circ2)/2.5;

  //c += wave*pn;

  c.r *= .1;
  c.rg *= rot(time/6.);
  c.bg *= rot(time/7.);


  gl_FragColor=vec4(c, 1);
}
