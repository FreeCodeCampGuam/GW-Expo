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
  // 1
  vec2 nuv = uv;
  uv /= 2.;

  float theta = atan(uv.x, uv.y);

  // 2
  vec3 wave = texture2D(spectrum, (nuv+.5)/20.).xyz;
  // 1 draw wave2
  vec3 wave2 = texture2D(spectrum, (nuv)*rot(PI*.5)+.35).xyz;

  // 2 add pn to wave2
  float pn = perlin(vec4(uv*3.*atan(uv.x,uv.y-.5), time/10., wave.x*3.));

  // 3
  // 5 * theta
  c.r += step(.8, fract(uv.x*20. + pn)) * theta;
  // 6 step(.5, it); and remove /3. and switch to -=
  c.b -= step(.5, fract(uv.x*20. - pn));
  //c -= max(vec3(0),wave2/pn);

  // 4
  c.rg *= rot(time/2.);
  c.gb *= rot(time/3.);



  gl_FragColor=vec4(c, 1);
}

// todo: water dripping from pipe
//
// cylinder np
// move 1d + time
// limit 1d
// mod 1d
// circ radius -.1*perlin*3
