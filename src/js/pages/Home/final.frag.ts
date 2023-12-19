export default `
precision highp float;

uniform sampler2D u_rawTex;
uniform sampler2D u_blurTex;
uniform vec2 u_resolution;
uniform float u_power;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    // gl_FragColor = vec4(uv, 0.0, 1.0);

    gl_FragColor = mix(texture2D(u_rawTex, uv), texture2D(u_blurTex, uv), u_power);

    #include <tonemapping_fragment>
	#include <colorspace_fragment>
}
`;
