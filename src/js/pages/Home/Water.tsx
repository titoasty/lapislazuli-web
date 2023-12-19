import { useTexture } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import { Water as WaterMesh } from 'three/addons/objects/Water.js';

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
            waterColor: 0x001e0f,
            distortionScale: 3.7,
            // fog: scene.fog !== undefined,
            // map: objWater.material.map,
        });

        water.rotation.x = -Math.PI / 2;

        return water;
    }, []);

    useFrame((state, delta) => {
        water.material.uniforms.time.value += delta * 0.5;
    });

    return <primitive object={water} {...props} />;
}
