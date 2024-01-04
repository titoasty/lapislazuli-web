import { Camera, Euler, Object3D, Quaternion, Spherical, Vector3 } from 'three';
import { getMousePos } from 'util/mouseutils';

export default class ObjectControls {
    domElement: HTMLElement;
    camera: Camera;
    target: Object3D;
    private unbind: () => void;
    lastTime: number;

    minRotationX = -Math.PI * 0.5 + 0.001;
    maxRotationX = Math.PI * 0.5 + 0.001;
    rotationSpeed = 1;

    constructor(domElement: HTMLElement, camera: Camera, target: Object3D) {
        this.domElement = domElement;
        this.camera = camera;
        this.target = target;
        this.lastTime = Date.now();

        let isDragging = false;
        let isZooming = false;
        let prevX = 0;
        let prevY = 0;
        let prevY1 = 0;
        let prevY2 = 0;

        const onPointerDown = (evt: TouchEvent | MouseEvent) => {
            if (evt instanceof TouchEvent) {
                if (evt.touches.length >= 2) {
                    console.log('zoom');

                    // zoom
                    isZooming = true;
                    prevY1 = evt.touches[0].pageY;
                    prevY2 = evt.touches[1].pageY;
                } else if (evt.touches.length === 1) {
                    // drag
                    isDragging = true;
                    prevX = evt.touches[0].pageX;
                    prevY = evt.touches[0].pageY;
                }
            } else {
                // drag
                isDragging = true;
                prevX = evt.pageX;
                prevY = evt.pageY;
            }
        };

        const onPointerUp = (evt: TouchEvent | MouseEvent) => {
            isDragging = false;
            isZooming = false;
        };

        const onPointerMove = (evt: TouchEvent | MouseEvent) => {
            if (isDragging) {
                const mousePos = getMousePos(evt);

                const diffX = mousePos.x - prevX;
                const diffY = mousePos.y - prevY;

                const angleX = (this.rotationSpeed * diffY) / 200;
                const angleY = (this.rotationSpeed * diffX) / 200;

                // target.rotateOnWorldAxis(new Vector3(0, 0, -1), angleX);
                // target.rotateOnWorldAxis(new Vector3(0, 1, 0), angleY);
                
                target.rotation.y += angleY;

                // target.rotateY((this.rotationSpeed * diffX) / 200);
                // target.rotateX((this.rotationSpeed * diffY) / 200);
                // target.rotation.x += (this.rotationSpeed * diffY) / 200;
                // target.rotation.z += (this.rotationSpeed * diffY) / 200;
                // target.rotation.y += (this.rotationSpeed * diffX) / 200;
                console.log(target.rotation);

                prevX = mousePos.x;
                prevY = mousePos.y;
            }

            if (isZooming && evt instanceof TouchEvent && evt.touches.length >= 2) {
                const x1 = evt.touches[0].pageX;
                const y1 = evt.touches[0].pageY;
                const x2 = evt.touches[1].pageX;
                const y2 = evt.touches[2].pageY;

                const diffY1 = y1 - prevY1;
                const diffY2 = y2 - prevY2;

                const diff = Math.abs(y1) > Math.abs(y2) ? y1 : y2;
                target.scale.addScalar(diff / 200);
                console.log('zooming', diff);

                prevY1 = y1;
                prevY2 = y2;
            }
        };

        const onWheel = (evt: WheelEvent) => {};

        domElement.addEventListener('pointerdown', onPointerDown);
        domElement.addEventListener('pointerup', onPointerUp);
        domElement.addEventListener('pointermove', onPointerMove);
        domElement.addEventListener('wheel', onWheel);

        this.unbind = () => {
            domElement.removeEventListener('pointerdown', onPointerDown);
            domElement.removeEventListener('pointerup', onPointerUp);
            domElement.removeEventListener('pointermove', onPointerMove);
            domElement.removeEventListener('wheel', onWheel);
        };
    }

    update() {
        const now = Date.now();
        const delta = (now - this.lastTime) / 1000;
        this.lastTime = now;
    }

    dispose() {
        this.unbind();
    }
}
