import { Plane, useTexture } from '@react-three/drei';

export function H2oLogo(props: any) {
    const tex = useTexture('/3d/h2o-logo.png');

    return (
        <Plane args={[7, 7]} {...props}>
            <meshBasicMaterial map={tex} transparent />
        </Plane>
    );
}
