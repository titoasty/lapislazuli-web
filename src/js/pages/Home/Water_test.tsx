import { Plane, useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { MeshPhysicalMaterial } from 'three';
import CustomShaderMaterial from 'three-custom-shader-material';
import { Water as WaterMesh } from 'three/addons/objects/Water.js';

/*
export function Water(props: any) {
    const waternormalsTex = useTexture('/3d/waternormals.jpg');
    waternormalsTex.wrapS = waternormalsTex.wrapT = THREE.RepeatWrapping;

    const water = useMemo(() => {
        const waterGeometry = new THREE.PlaneGeometry(10000, 10000);

        const water = new WaterMesh(waterGeometry, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: waternormalsTex,
            sunDirection: new THREE.Vector3(),
            sunColor: 0xffffff,
            // waterColor: 0x001e0f,
            waterColor: 0x66ddbb,
            distortionScale: 3.7,
            // fog: scene.fog !== undefined,
            // map: objWater.material.map,
        });

        water.rotation.x = -Math.PI / 2;

        return water;
    }, []);

    useFrame((state, delta) => {
        water.material.uniforms.time.value += delta * 0.25;
    });

    return <primitive object={water} {...props} />;
}
*/

const vertexShader = `
varying vec4 worldPosition;
varying vec2 vUv;

void main() {
    vec4 mirrorCoord = modelMatrix * vec4( position, 1.0 );
    worldPosition = mirrorCoord.xyzw;
    vUv = uv;
}
`;

const fragmentShader = `
uniform sampler2D normalSampler;
uniform float distortionScale;
uniform float time;
uniform float size;
uniform vec3 eye;

varying vec4 worldPosition;
varying vec2 vUv;

vec3 csm_NormalMap;

vec4 getNoise( vec2 uv ) {
    vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);
    vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );
    vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );
    vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );
    vec4 noise = texture2D( normalSampler, uv0 ) +
        texture2D( normalSampler, uv1 ) +
        texture2D( normalSampler, uv2 ) +
        texture2D( normalSampler, uv3 );
    return noise * 0.5 - 1.0;
}

void main() {
    vec3 worldToEye = eye-worldPosition.xyz;
    float distance = length(worldToEye);

    vec4 noise = getNoise(worldPosition.xz * size);
    vec3 surfaceNormal = normalize( noise.xzy * vec3(1.5, 1.0, 1.5));
    vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;

    csm_DiffuseColor.rgb = vec3(distortion, 0.0);

    csm_NormalMap = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
}
`;

export function Water({ waterObj, ...props }: any) {
    const waternormalsTex = useTexture('/3d/waternormals.jpg');
    waternormalsTex.wrapS = waternormalsTex.wrapT = THREE.RepeatWrapping;

    const mat = waterObj.material;

    const uniforms = useMemo(
        () => ({
            normalSampler: {
                value: waternormalsTex,
            },
            time: {
                value: 0,
            },
            distortionScale: {
                value: 4,
            },
            size: {
                value: 10,
            },
            eye: {
                value: [0, 0, 0],
            },
        }),
        []
    );

    useFrame((state, delta) => {
        uniforms.eye.value = [state.camera.position.x, state.camera.position.y, state.camera.position.z];
        uniforms.time.value += delta;
    });

    return (
        <>
            <Plane args={[1000, 1000]} {...props} rotation={[-Math.PI * 0.5, 0, 0]}>
                {/* <meshPhysicalMaterial color={mat.color} map={mat.map} emissiveMap={mat.emissiveMap} emissive={mat.emissive} reflectivity={mat.reflectivity} roughness={mat.roughness} /> */}
                <CustomShaderMaterial
                    baseMaterial={MeshPhysicalMaterial}
                    vertexShader={vertexShader}
                    fragmentShader={fragmentShader}
                    patchMap={{
                        csm_NormalMap: {
                            '#include <normal_fragment_maps>': `
                            vec3 mapN = csm_NormalMap;
                            mapN.xy *= normalScale;
                            normal = perturbNormal2Arb( - vViewPosition, normal, mapN, faceDirection );
                          `,
                        },
                    }}
                    color={mat.color}
                    map={mat.map}
                    emissiveMap={mat.emissiveMap}
                    emissive={mat.emissive}
                    reflectivity={mat.reflectivity}
                    roughness={mat.roughness}
                    normalMap={mat.normalMap}
                    uniforms={uniforms}
                />
            </Plane>
        </>
    );
}
