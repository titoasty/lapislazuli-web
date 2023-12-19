import Signal from './Signal';

let enabled = true;

document.addEventListener('visibilitychange', function (ev: Event) {
    if (document.hidden) {
        enabled = false;
    } else {
        enabled = true;
    }
});

const onRAF = new Signal<[number]>();

let lastTime = performance.now();
(function loop() {
    requestAnimationFrame(loop);
    if (!enabled) return;

    const now = performance.now();
    const delta = (now - lastTime) / 1000;
    lastTime = now;

    onRAF.emit(delta);
})();

export default onRAF;
