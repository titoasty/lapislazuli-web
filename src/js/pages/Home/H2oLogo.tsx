import { Plane, Svg, useTexture } from '@react-three/drei';
import { useMemo } from 'react';
import { MeshBasicMaterial } from 'three';
import CustomShaderMaterial from 'three-custom-shader-material';

const vertexShader = `
varying vec2 vUv;

void main() {
    vUv = uv;
}
`;

const fragmentShader = `
varying vec2 vUv;

void main() {
    /*
    float dst = csm_FragColor.a;
    float f = fwidth(dst);
    float alpha = smoothstep(0.5-f, 0.5, dst);
    */  
    float dist = (0.5-csm_FragColor.a) * 10.0;
    vec2 duv = fwidth(vUv); 
    float dtex = length(duv * vec2(1024.0)); 
    float pixelDist = dist * 2.0 / dtex;
    float alpha = saturate(0.5 - 1.3*pixelDist);

    csm_FragColor = vec4(csm_FragColor.rgb, alpha);
}
`;

export function H2oLogo(props: any) {
    const tex = useTexture('/3d/h2o-logo.png');
    // const tex = useTexture('/3d/h2o-logo_sdf_2k.png');
    // tex.generateMipmaps = true;

    const uniforms = useMemo(
        () => ({
            diffuse: {
                value: [1, 1, 1],
            },
            opacity: {
                value: 1,
            },
            reflectivity: {
                value: 1,
            },
            u_tex: {
                value: tex,
            },
            map: {
                value: tex,
            },
        }),
        []
    );

    return (
        <Plane args={[7, 7]} {...props}>
            <meshBasicMaterial map={tex} transparent />
            {/* <CustomShaderMaterial baseMaterial={MeshBasicMaterial} vertexShader={vertexShader} fragmentShader={fragmentShader} map={tex} transparent /> */}
        </Plane>
    );
}
