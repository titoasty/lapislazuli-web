export function rand(min?: number, max?: number) {
    if (typeof min === 'undefined') {
        min = 0;
        max = 1;
    } else if (typeof max === 'undefined') {
        max = min;
        min = 0;
    }

    return min + Math.random() * (max - min);
}

export function mix(val1: number, val2: number, ratio: number) {
    return val1 + ratio * (val2 - val1);
}

export function clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
}

export function clamp01(value: number) {
    return Math.max(0, Math.min(1, value));
}

export function generateID() {
    let array = new Uint32Array(8);
    window.crypto.getRandomValues(array);
    let str = '';
    for (let i = 0; i < array.length; i++) {
        str += (i < 2 || i > 5 ? '' : '-') + array[i].toString(16).slice(-4);
    }
    return str;
}

export const formatDecimals = (value: number, decimals: number | undefined) => (typeof decimals === 'undefined' ? value : Math.floor(value * Math.pow(10, decimals)) / Math.pow(10, decimals));

export function normalize(x: number, y: number) {
    const len = Math.sqrt(x * x + y * y);
    return { x: x / len, y: y / len };
}

export function shuffle<T>(array: T[]) {
    return [...array].sort(() => Math.random() - 0.5);
}

export function remap(value: number, low1: number, high1: number, low2: number, high2: number) {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
}
