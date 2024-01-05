import { Billboard, Box, Plane, ScreenSpace, useFBO, useGLTF, useHelper, useTexture } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import gsap from 'gsap';
import useWindowSize from 'hooks/useWindowSize';
import { Fragment, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BoxHelper, Group, PerspectiveCamera, RawShaderMaterial, RepeatWrapping, Scene, Spherical, Vector3 } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { H2oLogo } from './H2oLogo/H2oLogo';
import checkpoints from './checkpoints';

import { setPopinPaintingVisible } from 'components/PopinPainting/PopinPainting';
import zmooth from 'util/zmooth';
import { HomeLights } from './HomeLights';
import Painting3DViewer from './Painting3DViewer';
import { Water } from './Water/Water';
import baseVertexShader from './base.vert';
import blurFragmentShader from './blur.frag';
import blurVertexShader from './blur.vert';
import finalFragmentShader from './final.frag';

let _enterVenice: () => void;
export function enterVenice() {
    _enterVenice?.();
}

let _closePainting: any;
export const hidePainting = () => _closePainting();

let blurMaterial: RawShaderMaterial;
const cameraPos = new Vector3();
const cameraRot = new Vector3();
let scrollEnabled = false;

let painting3DViewer: Painting3DViewer;

const sx = zmooth.val(0, 3);
const sy = zmooth.val(0, 3);

function getCheckpointById(id: string) {
    for (const checkpoint of checkpoints) {
        if (checkpoint.id == id) {
            return checkpoint;
        }
    }

    return null;
}

export function Home3D() {
    const windowSize = useWindowSize();
    const obj = useGLTF('/3d/venice.glb');
    const three = useThree();
    const paintings = [
        useGLTF('/3d/test_painting1.glb'), //
    ];
    const noiseTex = useTexture('/3d/noise.png');
    noiseTex.wrapS = noiseTex.wrapT = RepeatWrapping;
    const [selectedCheckpoint, setSelectedCheckpoint] = useState<any>(null);
    const [idxScroll, setIdxScroll] = useState(0);

    const sceneRef = useRef<Scene>(null);
    const screenSceneRef = useRef<Scene>(null);
    const paintingSceneRef = useRef<Scene>(null);
    const paintingGroupRef = useRef<Group>(null);
    const w = window.innerWidth * 0.25;
    const h = window.innerHeight * 0.25;
    const fboScene = useFBO({
        samples: 4,
    });
    const fbo1 = useFBO(w, h);
    const fbo2 = useFBO(w, h);

    const paintingRefs: { [key: string]: RefObject<Group> } = {};
    checkpoints.forEach((checkpoint) => (paintingRefs[checkpoint.id] = useRef<Group>(null)));
    const paintingRef = useRef<Group>(null);

    useEffect(() => {
        cameraPos.set(52, 6, 70);
        cameraRot.set(0.12, 0, 0);

        let currIdx = 0;

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
                    setIdxScroll(currIdx);
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
                scrollPrev();
            } else if (evt.deltaY < 0) {
                scrollNext();
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
                uniforms.u_blurPower,
                {
                    value: 0,
                    duration: 0.5,
                    ease: 'sine.out',
                },
                0
            );
        };

        // animEnter();

        // gsap.to(uniforms.u_paintingPower, {
        //     value: 1,
        //     duration: 2,
        //     repeat: -1,
        //     yoyo: true,
        //     ease: 'sine.inOut',
        // });

        return () => {
            window.removeEventListener('wheel', onWheel);
        };
    }, []);

    useFrame((state, delta) => {
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

        // manage paintings placements
        // between venise scene & focused scene
        {
            if (selectedCheckpoint === null) {
                // remove painting from focused scene
                const pr = paintingRef.current!;
                pr.visible = false;
                while (pr.children.length > 0) {
                    pr.remove(pr.children[0]);
                }

                // put all paintings to their venise scene positions
                for (const checkpoint of checkpoints) {
                    if (!checkpoint.anchor) {
                        continue;
                    }

                    const group = paintingRefs[checkpoint.id].current!;
                    if (group.children.length > 0) {
                        continue;
                    }
                    group.add(paintings[checkpoint.anchor.index].scene);
                }
            } else {
                // put painting in focused scene
                const mesh = paintings[selectedCheckpoint.anchor?.index].scene;

                paintingRef.current!.add(mesh);
                paintingRef.current!.visible = true;

                const groupRef = paintingRefs[selectedCheckpoint.id];
                groupRef.current!.remove(mesh);
            }
        }

        const scene = sceneRef.current!;
        const screenScene = screenSceneRef.current!;
        const paintingScene = paintingSceneRef.current!;
        const camera = state.camera;
        const gl = state.gl;

        // update camera
        camera.position.set(cameraPos.x - sx.value * 0.1, cameraPos.y + sy.value * 0.1, cameraPos.z);
        camera.rotation.set(cameraRot.x, cameraRot.y, cameraRot.z);

        uniforms.u_resolution.value = [window.innerWidth, window.innerHeight];
        uniforms.u_time.value += delta;
        uniforms.u_showPainting.value = !!selectedCheckpoint ? 1 : 0;

        // render full scene to FBO
        scene.visible = true;
        gl.setRenderTarget(fboScene);
        gl.setClearColor(0xffffff, 0);
        gl.clear();
        gl.render(scene, camera);
        gl.setRenderTarget(null);
        scene.visible = false;

        // render single painting
        if (!!selectedCheckpoint) {
            painting3DViewer?.update();
        }

        // blur whole scene
        if (uniforms.u_blurPower.value > 0.01) {
            // split blur, 2 times
            let fboSrc = fboScene;
            let fboDst = fbo1;
            for (let i = 0; i < 2; i++) {
                screenScene.visible = true;
                screenScene.overrideMaterial = blurMaterial;
                blurMaterial.uniforms.u_resolution.value = [fboDst.width, fboDst.height];
                blurMaterial.uniforms.u_tex.value = fboSrc.texture;
                blurMaterial.uniforms.u_direction.value = [0.5, 0];
                gl.setRenderTarget(fboDst);
                gl.setClearColor(0xffffff, 0);
                gl.clear();
                gl.render(screenScene, camera);
                gl.setRenderTarget(null);
                screenScene.visible = false;

                fboSrc = fbo1;
                fboDst = fbo2;

                screenScene.visible = true;
                screenScene.overrideMaterial = blurMaterial;
                blurMaterial.uniforms.u_resolution.value = [fboDst.width, fboDst.height];
                blurMaterial.uniforms.u_tex.value = fboSrc.texture;
                blurMaterial.uniforms.u_direction.value = [0, 0.5];
                gl.setRenderTarget(fboDst);
                gl.setClearColor(0xffffff, 0);
                gl.clear();
                gl.render(screenScene, camera);
                gl.setRenderTarget(null);
                screenScene.visible = false;

                fboSrc = fbo2;
                fboDst = fbo1;
            }
        }
    });

    const uniforms = useMemo(
        () => ({
            u_rawTex: {
                value: fboScene.texture,
            },
            u_blurTex: {
                value: fbo2.texture,
            },
            u_paintingTex: {
                value: null,
            },
            u_resolution: {
                value: [window.innerWidth, window.innerHeight],
            },
            u_blurPower: {
                value: 1,
            },
            u_paintingPower: {
                value: 0,
            },
            u_noiseTex: {
                value: noiseTex,
            },
            u_time: {
                value: 0,
            },
            u_showPainting: {
                value: 0,
            },
        }),
        []
    );

    const openPainting = useCallback(
        (checkpoint: any) => {
            if (!!selectedCheckpoint) {
                return;
            }

            setSelectedCheckpoint(checkpoint);
            scrollEnabled = false;

            gsap.to(uniforms.u_paintingPower, {
                value: 1,
                duration: 0.8,
                ease: 'sine.in',
            });

            const group = paintingGroupRef.current!;

            group.visible = true;
            group.position.x = checkpoint.position[0] + checkpoint.anchor.position[0];
            group.position.y = checkpoint.position[1] + checkpoint.anchor.position[1];
            group.position.z = checkpoint.position[2] + checkpoint.anchor.position[2];
            group.rotation.set(checkpoint.anchor.rotation[0], checkpoint.anchor.rotation[1], checkpoint.anchor.rotation[2]);

            painting3DViewer = new Painting3DViewer(three.gl, three.camera as PerspectiveCamera, paintingSceneRef.current!, group, three.gl.domElement);
            uniforms.u_paintingTex.value = painting3DViewer.texture;

            setPopinPaintingVisible(true);
        },
        [selectedCheckpoint]
    );

    const closePainting = useCallback(() => {
        if (!selectedCheckpoint) {
            return;
        }

        const checkpoint = selectedCheckpoint;

        const group = paintingGroupRef.current!;

        // gsap.to(group.position, {
        //     x: checkpoint.position[0] + checkpoint.anchor.position[0],
        //     duration: 0.8,
        //     ease: 'back.inOut(2)',
        // });

        gsap.to(uniforms.u_paintingPower, {
            value: 0,
            duration: 0.8,
            ease: 'sine.in',
            onComplete: () => {
                setSelectedCheckpoint(null);
                scrollEnabled = true;
                group.visible = false;
            },
        });

        painting3DViewer?.hide();

        setPopinPaintingVisible(false);
    }, [selectedCheckpoint, paintingGroupRef.current]);
    _closePainting = closePainting;

    const showCursorPointer = useCallback(() => {
        document.body.style.cursor = 'pointer';
    }, []);
    const hideCursorPointer = useCallback(() => {
        document.body.style.cursor = '';
    }, []);

    return (
        <>
            <scene ref={sceneRef} visible={false} dispose={null}>
                <HomeLights />

                {/* <primitive object={obj.nodes.Water} /> */}
                <Water waterObj={obj.nodes.Water} position={[0, obj.nodes.Water.position.y, 0]} />

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
                    // .filter((checkpoint) => checkpoint != selectedCheckpoint)
                    .map((checkpoint) => {
                        const isScrollOn = checkpoints[idxScroll] == checkpoint;

                        return (
                            <Fragment key={checkpoint.id}>
                                <group
                                    ref={paintingRefs[checkpoint.id]}
                                    position={[
                                        checkpoint.position[0] + checkpoint.anchor.position[0], //
                                        checkpoint.position[1] + checkpoint.anchor.position[1],
                                        checkpoint.position[2] + checkpoint.anchor.position[2],
                                    ]}
                                    rotation={checkpoint.anchor.rotation}
                                    // visible={selectedCheckpoint != checkpoint}
                                />
                                <Box
                                    args={[3, 3, 1]}
                                    position={[
                                        checkpoint.position[0] + checkpoint.anchor.position[0], //
                                        checkpoint.position[1] + checkpoint.anchor.position[1],
                                        checkpoint.position[2] + checkpoint.anchor.position[2],
                                    ]}
                                    rotation={checkpoint.anchor.rotation}
                                    onClick={isScrollOn ? (e) => openPainting(checkpoint) : undefined}
                                    onPointerEnter={isScrollOn ? showCursorPointer : undefined}
                                    onPointerLeave={isScrollOn ? hideCursorPointer : undefined}
                                >
                                    <meshBasicMaterial color={[0, 1, 0]} visible={false} />
                                </Box>
                            </Fragment>
                        );
                    })}
                {/* {checkpoints.map((checkpoint, idx) => (
                <Box key={idx} args={[1, 1, 1]} position={checkpoint.position} />
            ))} */}
            </scene>

            <scene ref={paintingSceneRef} visible={false} dispose={null}>
                <HomeLights />

                <group ref={paintingGroupRef}>
                    <group ref={paintingRef} />
                </group>
            </scene>

            <scene ref={screenSceneRef} visible={false}>
                <Plane args={[100, 100]} />
            </scene>

            <ScreenSpace>
                <Plane args={[100, 100]}>
                    <shaderMaterial vertexShader={baseVertexShader} fragmentShader={finalFragmentShader} uniforms={uniforms} />
                </Plane>
            </ScreenSpace>
        </>
    );
}
