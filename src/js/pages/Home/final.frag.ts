export default `
precision highp float;

uniform sampler2D u_tex;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    // gl_FragColor = vec4(uv, 0.0, 1.0);
    gl_FragColor = texture2D(u_tex, uv);
}
`;
