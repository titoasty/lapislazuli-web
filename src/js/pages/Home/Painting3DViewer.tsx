import gsap from 'gsap';
import { Box3, Object3D, PerspectiveCamera, Scene, Spherical, Texture, Vector3, WebGLRenderTarget, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// compute distance from camera so object fits the screen
function computeDistance(camera: PerspectiveCamera, obj: Object3D) {
    // we clear rotation for correct bounds computation
    const backupRotation = obj.rotation.clone();
    obj.rotation.set(0, 0, 0);
    const box = new Box3();
    box.setFromObject(obj);
    obj.rotation.copy(backupRotation);

    const size = new Vector3();
    box.getSize(size);

    const fov = camera.fov * (Math.PI / 180);
    const fovh = 2 * Math.atan(Math.tan(fov / 2) * camera.aspect);
    const dx = 1.3 * (size.z / 2 + Math.abs(size.x / 2 / Math.tan(fovh / 2)));
    const dy = 1.6 * (size.z / 2 + Math.abs(size.y / 2 / Math.tan(fov / 2)));

    return Math.max(dx, dy);
}

export default class Painting3DViewer {
    update: () => void;
    resize: () => void;
    hide: () => void;
    texture: Texture;

    constructor(gl: WebGLRenderer, camera: PerspectiveCamera, scene: Scene, obj: Object3D, domElement: HTMLElement) {
        camera = camera.clone();

        const fbo = new WebGLRenderTarget(window.innerWidth, window.innerHeight, {
            samples: 4,
        });
        this.texture = fbo.texture;

        let initialPhi = 0;
        let initialTheta = 0;
        let initialRadius = 0;

        camera.position.sub(obj.position);
        obj.position.set(0, 0, 0);

        let controls: OrbitControls;

        let initialized = false;

        this.update = () => {
            if (!initialized) {
                initialized = true;

                initialRadius = camera.position.length();
                const dist = computeDistance(camera, obj);
                const target = camera.position.clone().normalize().multiplyScalar(dist);

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
            }

            controls?.update();

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
        };
    }

    dispose() {
        gsap.ticker.remove(this.update);
        window.removeEventListener('resize', this.resize);
    }
}
