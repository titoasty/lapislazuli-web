import { useGLTF, useProgress, useTexture } from '@react-three/drei';
import useLoaded from 'hooks/useLoaded';
import { useEffect, useState } from 'react';
import { Box3 } from 'three';

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
    const { loaded, setLoaded, setLoadedPercent, setPreloaded } = useLoaded();
    const { active } = useProgress();
    const p = useProgress();

    if (preload && !active) {
        const gltfs: any = {};
        assets.filter((asset) => asset.endsWith('.glb')).forEach((url) => (gltfs[url] = useGLTF(url)));

        const obj = gltfs['/3d/test_painting1.glb'].scene;
        if (!obj.userData.initialized) {
            obj.userData.initialized = true;

            // rescale
            const box = new Box3().setFromObject(obj);
            const maxSize = Math.max(box.max.x - box.min.x, Math.min(box.max.y - box.min.y, box.max.z - box.min.z));
            const scale = 2.9 / maxSize;
            obj.scale.set(scale, scale, scale);

            // recenter
            box.setFromObject(obj);
            obj.position.x = -(box.max.x + box.min.x) / 2;
            obj.position.y = -(box.max.y + box.min.y) / 2;
            obj.position.z = -(box.max.z + box.min.z) / 2;
        }
    }

    useEffect(() => {
        pctLoaded = Math.max(pctLoaded, (100 * p.loaded) / (p.total || 1));
        setLoadedPercent(pctLoaded);
    }, [p]);

    useEffect(() => {
        console.log('preload');

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
            // setPreloaded(true);
            setLoaded(true);
        }, 500);
    }, [active, preload]);

    return null;
}
