import { useGLTF, useProgress, useTexture } from '@react-three/drei';
import useLoaded from 'hooks/useLoaded';
import { useEffect, useState } from 'react';

const assets = [
    '/3d/venice.glb', //
    '/3d/test_painting1.glb',
    '/3d/noise.png',
    '/3d/h2o-logo.png',
    '/3d/waternormals.jpg',
];

let pctLoaded = 0;

export function AsyncLoader() {
    const [preload, setPreload] = useState(false);
    const { loaded, setLoaded, setLoadedPercent } = useLoaded();
    const { active } = useProgress();
    const p = useProgress();

    useEffect(() => {
        pctLoaded = Math.max(pctLoaded, (100 * p.loaded) / (p.total || 1));
        setLoadedPercent(pctLoaded);
    }, [p]);

    useEffect(() => {
        for (const url of assets) {
            const ext = url.split('.').pop();

            console.log('load', ext, url);

            switch (ext) {
                case 'png':
                case 'jpg':
                case 'jpeg':
                    useTexture.preload(url);
                    break;
                case 'glb':
                case 'gltf':
                    useGLTF.preload(url);
                    break;
                default:
                    console.log('unknown type', url);
                    break;
            }
        }

        setPreload(true);
        // setLoaded(true);
    }, []);

    useEffect(() => {
        if (!preload) {
            return;
        }
        if (active) {
            return;
        }

        setTimeout(() => {
            setLoaded(true);
        }, 1500);
    }, [active, preload]);

    return null;
}
