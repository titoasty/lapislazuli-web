import { useGLTF } from '@react-three/drei';
import useLoaded from 'hooks/useLoaded';
import { useEffect } from 'react';

export function AsyncLoader() {
    const [loaded, setLoaded] = useLoaded();

    useEffect(() => {
        useGLTF.preload('/3d/venice.glb');
        useGLTF.preload('/3d/test_painting1.glb');
        useGLTF.preload('/3d/test_painting1.glb');
        useGLTF.preload('/3d/test_painting1.glb');
        useGLTF.preload('/3d/test_painting1.glb');
        useGLTF.preload('/3d/test_painting1.glb');

        setLoaded(true);
    }, []);

    return null;
}
