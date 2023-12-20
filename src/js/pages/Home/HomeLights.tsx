import { useMemo } from 'react';
import { SpotLight } from 'three';

export function HomeLights() {
    const spotlight = useMemo(() => new SpotLight('#ffddaa'), []);

    return (
        <>
            <ambientLight color={[1, 1, 1]} />

            <group position={[52, 50, -400]}>
                <primitive object={spotlight} intensity={0.5} decay={0.2} angle={1.5} distance={1500} />
                <primitive object={spotlight.target} position={[0, -20, 100]} />
            </group>

            <directionalLight position={[-1, 0.5, 0.5]} intensity={2} />
            <directionalLight position={[1, 0.5, 0.5]} intensity={2} />
        </>
    );
}
