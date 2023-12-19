import { Billboard, Bounds, Plane, useFBO, useGLTF } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import useWindowSize from 'hooks/useWindowSize';
import { useEffect, useMemo, useRef } from 'react';
import { RawShaderMaterial, Scene, Vector3 } from 'three';
import { H2oLogo } from './H2oLogo';
import checkpoints from './checkpoints';

import zmooth from 'util/zmooth';
import baseVertexShader from './base.vert';
import blurFragmentShader from './blur.frag';
import blurVertexShader from './blur.vert';
import finalFragmentShader from './final.frag';

let _enterVenice: () => void;
export function enterVenice() {
    _enterVenice?.();
}

let blurMaterial: RawShaderMaterial;
const cameraPos = new Vector3();
const cameraRot = new Vector3();

const sx = zmooth.val(0, 3);
const sy = zmooth.val(0, 3);

export function Home3D() {
    const windowSize = useWindowSize();
    const obj = useGLTF('/3d/venice.glb');
    const three = useThree();
    const paintings = [
        useGLTF('/3d/test_painting1.glb'), //
        useGLTF('/3d/test_painting1.glb'),
        useGLTF('/3d/test_painting1.glb'),
        useGLTF('/3d/test_painting1.glb'),
        useGLTF('/3d/test_painting1.glb'),
    ];

    const sceneRef = useRef<Scene>(null);
    const screenSceneRef = useRef<Scene>(null);
    const w = window.innerWidth * 0.25;
    const h = window.innerHeight * 0.25;
    const fboScene = useFBO({
        samples: 4,
    });
    const fbo1 = useFBO(w, h);
    const fbo2 = useFBO(w, h);

    useEffect(() => {
        cameraPos.set(52, 6, 70);
        cameraRot.set(0.12, 0, 0);

        let currIdx = 0;
        let scrollEnabled = false;

        const scrollTo = (id: string) => {
            if (!scrollEnabled) {
                return;
            }

            scrollEnabled = false;

            let newIdx = -1;
            for (let i = 0; i < checkpoints.length; i++) {
                if (checkpoints[i].id !== id) {
                    continue;
                }

                newIdx = i;
                break;
            }

            if (newIdx < 0) {
                console.log('checkpoint id not found:', id);
                return;
            }

            let diff = newIdx - currIdx;
            if (Math.abs(diff) > checkpoints.length * 0.5) {
                diff += diff < 0 ? checkpoints.length : -checkpoints.length;
            }
            const len = Math.abs(diff);
            const order = Math.sign(diff);
            const goBy = [];

            let idx = currIdx;
            for (let i = 0; i < len; i++) {
                idx += order;
                if (idx < 0) {
                    idx += checkpoints.length;
                } else {
                    idx = idx % checkpoints.length;
                }

                const checkpoint = checkpoints[idx];
                goBy.push(checkpoint);
            }

            const tl = gsap.timeline({
                onComplete: () => {
                    currIdx = newIdx;
                    scrollEnabled = true;
                },
            });

            let currAngle = three.camera.rotation.clone();
            for (let i = 0; i < goBy.length; i++) {
                const checkpoint = goBy[i];

                const duration = 1;

                let ease = 'linear';
                if (goBy.length === 1) {
                    ease = 'power2.out';
                } else {
                    if (i == 0) {
                        ease = 'power2.in';
                    }
                    if (i == goBy.length - 1) {
                        ease = 'power2.out';
                    }
                }

                // shortest angle from previous anim angle
                const diffX = ((checkpoint.rotation[0] - currAngle.x + Math.PI) % (Math.PI * 2)) - Math.PI;
                currAngle.x += diffX < -Math.PI ? diffX + Math.PI * 2 : diffX;
                const diffY = ((checkpoint.rotation[1] - currAngle.y + Math.PI) % (Math.PI * 2)) - Math.PI;
                currAngle.y += diffY < -Math.PI ? diffY + Math.PI * 2 : diffY;
                const diffZ = ((checkpoint.rotation[2] - currAngle.z + Math.PI) % (Math.PI * 2)) - Math.PI;
                currAngle.z += diffZ < -Math.PI ? diffZ + Math.PI * 2 : diffZ;

                tl.addLabel(checkpoint.id);
                tl.to(
                    cameraPos,
                    {
                        x: checkpoint.position[0],
                        y: checkpoint.position[1],
                        z: checkpoint.position[2],
                        duration,
                        ease,
                    },
                    checkpoint.id
                );
                tl.to(
                    cameraRot,
                    {
                        x: currAngle.x, //checkpoint.rotation[0],
                        y: currAngle.y, //checkpoint.rotation[1],
                        z: currAngle.z, //checkpoint.rotation[2],
                        duration,
                        ease,
                    },
                    checkpoint.id
                );
            }
        };

        const scrollNext = () => {
            let idx = (currIdx + 1) % checkpoints.length;
            while (checkpoints[idx].virtual) {
                idx = (idx + 1) % checkpoints.length;
            }
            scrollTo(checkpoints[idx].id);
        };

        const scrollPrev = () => {
            let idx = currIdx - 1;
            if (idx < 0) {
                idx += checkpoints.length;
            }

            while (checkpoints[idx].virtual) {
                idx = idx == 0 ? checkpoints.length - 1 : idx - 1;
            }
            scrollTo(checkpoints[idx].id);
        };

        const onWheel = (evt: WheelEvent) => {
            if (evt.deltaY > 0) {
                scrollNext();
            } else if (evt.deltaY < 0) {
                scrollPrev();
            }
        };
        window.addEventListener('wheel', onWheel);

        // const onMouseMove = (evt: MouseEvent) => {
        //     const mousePos = getMousePos(evt);
        //     sx.to = (mousePos.x / window.innerWidth) * 2 - 1;
        //     sy.to = (mousePos.y / window.innerHeight) * 2 - 1;
        // };
        // window.addEventListener('mousemove', onMouseMove);

        // anim enter
        _enterVenice = () => {
            const tl = gsap.timeline({
                onComplete: () => {
                    scrollEnabled = true;
                },
            });

            const startCheckpoint = checkpoints[0];
            tl.to(
                cameraPos,
                {
                    x: startCheckpoint.position[0],
                    y: startCheckpoint.position[1],
                    z: startCheckpoint.position[2],
                    duration: 4,
                    ease: 'power3.inOut',
                },
                startCheckpoint.id
            );
            tl.to(
                cameraRot,
                {
                    x: startCheckpoint.rotation[0],
                    y: startCheckpoint.rotation[1],
                    z: startCheckpoint.rotation[2],
                    duration: 4,
                    ease: 'power3.inOut',
                },
                startCheckpoint.id
            );

            tl.to(
                uniforms.u_power,
                {
                    value: 0,
                    duration: 0.5,
                    ease: 'sine.out',
                },
                0
            );
        };

        // animEnter();

        return () => {
            window.removeEventListener('wheel', onWheel);
        };
    }, []);

    useFrame((state) => {
        if (!blurMaterial) {
            blurMaterial = new RawShaderMaterial({
                vertexShader: blurVertexShader,
                fragmentShader: blurFragmentShader,
                uniforms: {
                    u_tex: {
                        value: fbo1.texture,
                    },
                    u_resolution: {
                        value: [fbo1.width, fbo1.height],
                    },
                    u_direction: {
                        value: [1, 0],
                    },
                },
            });
        }

        const scene = sceneRef.current!;
        const screenScene = screenSceneRef.current!;
        const camera = state.camera;

        // update camera
        camera.position.set(cameraPos.x - sx.value * 0.1, cameraPos.y + sy.value * 0.1, cameraPos.z);
        camera.rotation.set(cameraRot.x, cameraRot.y, cameraRot.z);

        // render full scene to FBO
        scene.visible = true;
        state.gl.setRenderTarget(fboScene);
        state.gl.setClearColor(0xffffff, 0);
        state.gl.clear();
        state.gl.render(scene, camera);
        state.gl.setRenderTarget(null);
        scene.visible = false;

        // split blur, 2 times
        let fboSrc = fboScene;
        let fboDst = fbo1;
        for (let i = 0; i < 2; i++) {
            screenScene.visible = true;
            screenScene.overrideMaterial = blurMaterial;
            blurMaterial.uniforms.u_resolution.value = [fboDst.width, fboDst.height];
            blurMaterial.uniforms.u_tex.value = fboSrc.texture;
            blurMaterial.uniforms.u_direction.value = [0.5, 0];
            state.gl.setRenderTarget(fboDst);
            state.gl.setClearColor(0xffffff, 0);
            state.gl.clear();
            state.gl.render(screenScene, camera);
            state.gl.setRenderTarget(null);
            screenScene.visible = false;

            fboSrc = fbo1;
            fboDst = fbo2;

            screenScene.visible = true;
            screenScene.overrideMaterial = blurMaterial;
            blurMaterial.uniforms.u_tex.value = fboSrc.texture;
            blurMaterial.uniforms.u_direction.value = [0, 0.5];
            state.gl.setRenderTarget(fboDst);
            state.gl.setClearColor(0xffffff, 0);
            state.gl.clear();
            state.gl.render(screenScene, camera);
            state.gl.setRenderTarget(null);
            screenScene.visible = false;

            fboSrc = fbo2;
            fboDst = fbo1;
        }
    });

    const uniforms = useMemo(
        () => ({
            u_rawTex: {
                value: fboScene.texture,
            },
            u_blurTex: {
                value: fbo1.texture,
            },
            u_resolution: {
                value: [window.innerWidth, window.innerHeight],
            },
            u_power: {
                value: 1,
            },
        }),
        [windowSize]
    );

    useFrame((state, delta) => {
        const camera = state.camera;

        // start (fov 32)
        // camera.position.set(52, 6, 77);
        // camera.rotation.set(0.12, 0, 0);

        // start (fov 50)
        // camera.position.set(52, 7, 63);
        // camera.rotation.set(0.12, 0, 0);

        // start (fov 40)
        // camera.position.set(52, 6, 70);
        // camera.rotation.set(0.12, 0, 0);

        // carousel (fov 32)
        // camera.position.set(52, 4, 0);
        // camera.rotation.set(0.12, 0, 0);

        // carousel (fov 40)
        // camera.position.set(52, 4, -2);
        // camera.rotation.set(0.12, 0, 0);

        // above
        // camera.position.set(52, 130, 10);
        // camera.rotation.set(-Math.PI * 0.5, 0, 0);

        // camera.position.set(58, 8, 8);
        // camera.rotation.set(0, Math.PI*0.5, 0);
    });

    return (
        <>
            <scene ref={sceneRef} visible={false}>
                <ambientLight color={[1, 1, 1]} />
                <primitive object={obj.nodes.Water} />
                {/* <Water position={[0, obj.nodes.Water.position.y, 0]} /> */}
                <primitive object={obj.nodes.Skysphere} />
                <primitive object={obj.nodes.LeftArcades} />
                <primitive object={obj.nodes.RightArcades} />
                <primitive object={obj.nodes.CarousselBase} />
                <primitive object={obj.nodes.Portal} />
                <Billboard position={[obj.nodes.CarousselBase.position.x, obj.nodes.CarousselBase.position.y + 4.5, obj.nodes.CarousselBase.position.z]}>
                    <H2oLogo />
                </Billboard>
                {checkpoints
                    .filter((checkpoint) => !!checkpoint.anchor)
                    .map((checkpoint) => (
                        <primitive
                            key={checkpoint.id}
                            object={paintings[checkpoint.anchor?.index].scene} //
                            position={[
                                checkpoint.position[0] + checkpoint.anchor.position[0], //
                                checkpoint.position[1] + checkpoint.anchor.position[1],
                                checkpoint.position[2] + checkpoint.anchor.position[2],
                            ]}
                            rotation={checkpoint.anchor.rotation}
                            scale={checkpoint.anchor.scale}
                        />
                    ))}
                {/* {checkpoints.map((checkpoint, idx) => (
                <Box key={idx} args={[1, 1, 1]} position={checkpoint.position} />
            ))} */}
            </scene>

            <scene ref={screenSceneRef} visible={false}>
                <Plane args={[100, 100]} />
            </scene>

            <Bounds fit clip observe>
                <Plane args={[100, 100]} position={[52, 13, 30]}>
                    <shaderMaterial vertexShader={baseVertexShader} fragmentShader={finalFragmentShader} uniforms={uniforms} />
                </Plane>
            </Bounds>
        </>
    );
}