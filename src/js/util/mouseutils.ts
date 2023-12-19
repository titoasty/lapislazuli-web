export function getMousePos(ev: MouseEvent | TouchEvent | any) {
    if (ev.touches && ev.touches.length > 0) {
        return { x: ev.touches[0].pageX, y: ev.touches[0].pageY };
    }

    return { x: ev.pageX, y: ev.pageY };
}
