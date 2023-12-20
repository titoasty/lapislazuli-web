export default `
precision highp float;

uniform sampler2D u_rawTex;
uniform sampler2D u_blurTex;
uniform sampler2D u_paintingTex;
uniform vec2 u_resolution;
uniform float u_blurPower;
uniform float u_paintingPower;
uniform sampler2D u_noiseTex;
uniform float u_time;

#define clamp01(a) clamp((a), 0.0, 1.0)
#define PI 3.14159265359

vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)), dot(st,vec2(269.5,183.3)) );
    return -1.0 + 2.0*fract(sin(st)*43758.5453123);
}

// Value Noise by Inigo Quilez - iq/2013
// https://www.shadertoy.com/view/lsf3WH
float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);

    vec2 u = f*f*(3.0-2.0*f);

    return mix( mix( dot( random2(i + vec2(0.0,0.0) ), f - vec2(0.0,0.0) ),
                    dot( random2(i + vec2(1.0,0.0) ), f - vec2(1.0,0.0) ), u.x),
                mix( dot( random2(i + vec2(0.0,1.0) ), f - vec2(0.0,1.0) ),
                    dot( random2(i + vec2(1.0,1.0) ), f - vec2(1.0,1.0) ), u.x), u.y);
}

float circleNoise(vec2 st, float time) {
    float r = 0.8;
    float a = atan(st.y, st.x);
    float noiseA = a + time;

    vec2 nPos = vec2(cos(noiseA), sin(noiseA));

    float n = noise(nPos*1.0),
    n2 = noise(nPos*2.0 + time);
    
    r += sin(a*15.0) * n*.18;
    r += sin(a*25.0) * n2*.08;

    return smoothstep(0.25, 0.75, r*r*r);
}


void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    float fade = u_paintingPower; // sin(u_time)*0.5+0.5;

    vec2 dir = uv - vec2(0.5);
    float len = length(dir);

    float noise = texture2D(u_noiseTex, uv*0.25+u_time*0.05).r;//*0.5+u_time*0.03).r;
    noise = smoothstep(0.0, 1.0, noise);
    noise = pow(noise, 2.0);
    // gl_FragColor = vec4(noise, 0.0, 0.0, 1.0);
    // return;
    noise = 0.7 + 0.3*noise;

    float n = texture2D(u_noiseTex, vec2(0.7*len*noise-u_time*0.1)).r;

    n *= smoothstep(0.0, 0.2, len);
    n = smoothstep(0.3, 0.7, n);
    n *= fade;

    gl_FragColor = vec4(n, 0.0, 0.0, 1.0);
    // return;
    uv += n * 0.2 * dir;

    float f = 1.0 - cos((fade * PI) / 2.0);
    uv += -dir*smoothstep(0.0, 1.0, fade) * 0.5 * f;

    float fadeColorPower = 1.0 - smoothstep(-0.3, 0.0, (len - fade*f)*1.3);
    fadeColorPower *= fade;
    // float fadeColorPower = 1.0 - smoothstep(-0.05, 0.0, (length(uv-vec2(0.5)) - fade)*1.05);

    gl_FragColor = mix(texture2D(u_rawTex, uv), texture2D(u_blurTex, uv), u_blurPower);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(255.0/255.0, 246.0/255.0, 250.0/255.0), fadeColorPower);
    
    vec4 paintingColor = texture2D(u_paintingTex, gl_FragCoord.xy / u_resolution);
    gl_FragColor.rgb = gl_FragColor.rgb*(1.0-paintingColor.a) + paintingColor.rgb*paintingColor.a;

    #include <tonemapping_fragment>
	#include <colorspace_fragment>
}

/*
void main3() {
    vec2 uv = gl_FragCoord.xy / u_resolution;

    float noise = texture2D(u_noiseTex, uv*1.0).r;//*0.5+u_time*0.03).r;
    noise = smoothstep(0.0, 1.0, noise);
    noise = pow(noise, 2.0);
    // gl_FragColor = vec4(vec3(noise), 1.0);
    // return;

    float fade = sin(u_time)*0.5+0.5; //u_paintingPower;

    vec2 dir = uv - vec2(0.5);
    float len = length(dir);
    float s = cos(-u_time*4.0 + len*30.0 + noise*2.0);
    //s = s*0.5+0.5;
    //s = smoothstep(0.0, 1.0, s);
    // s *= smoothstep(0.2, 0.5, len);
    s = pow(s, 3.0);
    // uv += -dir * fade * 1.0;
    // uv += normalize(dir) * 0.5 * s * smoothstep(0.0, 0.3, len) * len*len * smoothstep(0.0, 0.2, fade);
    // uv += normalize(dir) * 0.5 * s * smoothstep(0.0, 0.3, len) *len*len* mix(1.0, 0.0+fade, clamp01(len)) * smoothstep(0.0, 0.2, fade);
    uv += -dir * fade * 0.5;

    vec2 dir2 = uv - vec2(0.5);
    float len2 = length(uv);
    uv += normalize(dir2) * 0.5 * s * smoothstep(0.0, 0.3, len2) *len2*len2* mix(1.0, 0.0+fade, clamp01(len2)) * smoothstep(0.0, 0.2, fade);

    // float f = length(normalize(dir) * 0.2 * s * smoothstep(0.0, 0.3, len));
    // gl_FragColor = vec4(vec3(f), 1.0);
    // return;

    float fadeColorPower = 1.0 - smoothstep(-0.2, 0.0, (len - fade)*1.2);
    // fadeColorPower = 0.0;
    // gl_FragColor = vec4(vec3(fadeColorPower), 1.0);
    // return;
    

    gl_FragColor = mix(texture2D(u_rawTex, uv), texture2D(u_blurTex, uv), u_blurPower);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0), fadeColorPower);
    
    vec4 paintingColor = texture2D(u_paintingTex, uv);
    gl_FragColor.rgb = gl_FragColor.rgb*(1.0-paintingColor.a) + paintingColor.rgb*paintingColor.a;
    // gl_FragColor = mix(gl_FragColor, texture2D(u_paintingTex, uv), 0.7);

    #include <tonemapping_fragment>
	#include <colorspace_fragment>
}
*/

/*
void main2() {
    vec2 uv = gl_FragCoord.xy / u_resolution;
    // gl_FragColor = vec4(uv, 0.0, 1.0);

    float cn = circleNoise(uv-vec2(0.5), u_time*0.5);

    float len = length(uv - vec2(0.5));
    vec2 dir = normalize(uv - vec2(0.5));
    
    float noise = texture2D(u_noiseTex, uv*0.5+u_time*0.03).r;
    noise += cn;
    noise /= 2.0;
    // gl_FragColor = vec4(vec3(noise), 1.0);
    // return;

    // float n = smoothstep(0.0, 0.2*smoothstep(0.0, 0.2, u_paintingPower), len-u_paintingPower);
    float n = 1.0 - smoothstep(0.0+u_paintingPower-0.5, 1.0*u_paintingPower, len+mix(noise, 0.0, u_paintingPower));

    n = mix(n, 1.0, (u_paintingPower-0.8)/0.2);
    gl_FragColor = vec4(vec3(n), 1.0);
    return;

    uv += -dir*len*n*0.5*u_paintingPower;

    gl_FragColor = mix(texture2D(u_rawTex, uv), texture2D(u_blurTex, uv), u_blurPower);
    // gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0), u_paintingPower);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, vec3(1.0), n);
    
    vec4 paintingColor = texture2D(u_paintingTex, uv);
    gl_FragColor.rgb = gl_FragColor.rgb*(1.0-paintingColor.a) + paintingColor.rgb*paintingColor.a;
    // gl_FragColor = mix(gl_FragColor, texture2D(u_paintingTex, uv), 0.7);

    #include <tonemapping_fragment>
	#include <colorspace_fragment>
}
*/
`;
