import gsap from 'gsap';
import { Box3, Object3D, PerspectiveCamera, Scene, Spherical, Texture, Vector3, WebGLRenderTarget, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { mix } from 'util/mathutils';

// compute distance between camera and object so object takes full height
function computeDistance(camera: PerspectiveCamera, obj: Object3D) {
    const backupRotation = obj.rotation.clone();
    obj.rotation.set(0, 0, 0);
    obj.scale.set(1, 1, 1);
    const box = new Box3();
    box.setFromObject(obj);
    obj.rotation.copy(backupRotation);
    const size = new Vector3();
    box.getSize(size);

    const dy = size.z * 0.5 + Math.abs(size.y / 2 / Math.tan((camera.fov * (Math.PI / 180)) / 2));

    return dy;
}

// compute object scale so it fits frameElement
function computeScale(camera: PerspectiveCamera, obj: Object3D, frameElement: HTMLElement) {
    const backupRotation = obj.rotation.clone();
    obj.rotation.set(0, 0, 0);
    obj.scale.set(1, 1, 1);
    const box = new Box3();
    box.setFromObject(obj);
    obj.rotation.copy(backupRotation);
    const size = new Vector3();
    box.getSize(size);

    const rect = frameElement.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const scaleY = height / window.innerHeight;
    const scaleX = (width / window.innerWidth) * (size.y / size.x) * camera.aspect;
    const scale = Math.min(scaleX, scaleY);

    const elt = frameElement.children[0] as HTMLElement;
    elt.style.width = `${(100 * scale) / scaleX}%`;
    elt.style.height = `${(100 * scale) / scaleY}%`;

    return scale;
}

export default class Painting3DViewer {
    update: () => void;
    resize: () => void;
    hide: () => void;
    texture: Texture;

    constructor(gl: WebGLRenderer, camera: PerspectiveCamera, scene: Scene, obj: Object3D, domElement: HTMLElement, frameElement: HTMLElement) {
        camera = camera.clone();

        // will render the painting to a fbo
        const fbo = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            samples: 4,
        });
        this.texture = fbo.texture;

        // keep track for animating back
        let initialPhi = 0;
        let initialTheta = 0;
        let initialRadius = 0;

        // center scene on origin
        camera.position.sub(obj.position);
        obj.position.set(0, 0, 0);

        let controls: OrbitControls;

        let initialized = false;

        // for scale animation
        const scaleAnim = {
            ratio: 0,
            target: 0,
        };

        this.update = () => {
            // wait for first update, so we're sure the painting is there
            if (!initialized) {
                initialized = true;

                // compute distance where the painting is displayed fullscreen
                initialRadius = camera.position.length();
                const target = camera.position.clone().normalize().multiplyScalar(computeDistance(camera, obj));

                // then rescale it to fit frameElement
                scaleAnim.target = computeScale(camera, obj, frameElement);

                // now animate the camera
                gsap.to(camera.position, {
                    x: target.x,
                    y: target.y,
                    z: target.z,
                    duration: 0.8,
                    ease: 'back.inOut(2)',
                    onComplete: () => {
                        controls = new OrbitControls(camera, domElement);
                        controls.update();
                        initialPhi = controls.getPolarAngle();
                        initialTheta = controls.getAzimuthalAngle();
                    },
                });

                // and animate the scale of the painting
                gsap.to(scaleAnim, {
                    ratio: 1,
                    duration: 0.8,
                    ease: 'back.inOut(2)',
                });
            }

            controls?.update();

            // dynamic scale, so animation is correct during window resize
            const scale = mix(1, scaleAnim.target, scaleAnim.ratio);
            obj.scale.set(scale, scale, scale);

            // render painting scene to fbo
            scene.visible = true;
            gl.setRenderTarget(fbo);
            gl.setClearColor(0xffffff, 0);
            gl.clear();
            gl.render(scene, camera);
            gl.setRenderTarget(null);
            scene.visible = false;
        };

        this.resize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            fbo.setSize(window.innerWidth, window.innerHeight);

            // if (initialized) {
            scaleAnim.target = computeScale(camera, obj, frameElement);
            // }
        };
        this.resize();
        window.addEventListener('resize', this.resize);

        // this.update();

        this.hide = () => {
            // rotate camera in front of painting
            const sph = new Spherical();
            sph.set(controls.getDistance(), controls.getPolarAngle(), controls.getAzimuthalAngle());
            const target = controls.target.clone();

            gsap.to(sph, {
                phi: initialPhi,
                theta: initialTheta,
                radius: initialRadius,
                duration: 0.8,
                ease: 'back.inOut(2)',
                onUpdate: () => {
                    camera.position.setFromSpherical(sph).add(target);
                    camera.lookAt(target);
                },
            });

            // scale painting to 1
            gsap.to(scaleAnim, {
                ratio: 0,
                duration: 0.8,
                ease: 'back.inOut(2)',
            });
        };
    }

    dispose() {
        window.removeEventListener('resize', this.resize);
    }
}
