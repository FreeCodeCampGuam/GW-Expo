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


void main() {
  vec3 c = vec3(.1,.1,.13);
  
  gl_FragColor=vec4(c, 1);
}
