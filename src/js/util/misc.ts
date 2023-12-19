export const debounce = <F extends (...args: Parameters<F>) => ReturnType<F>>(func: F, waitFor: number) => {
    let timeout: NodeJS.Timeout;

    const debounced = (...args: Parameters<F>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), waitFor);
    };

    return debounced;
};

export const throttle = (fn: Function, wait: number = 300) => {
    let inThrottle: boolean, lastFn: ReturnType<typeof setTimeout>, lastTime: number;
    return function (this: any) {
        const context = this,
            args = arguments;
        if (!inThrottle) {
            fn.apply(context, args);
            lastTime = Date.now();
            inThrottle = true;
        } else {
            clearTimeout(lastFn);
            lastFn = setTimeout(() => {
                if (Date.now() - lastTime >= wait) {
                    fn.apply(context, args);
                    lastTime = Date.now();
                }
            }, Math.max(wait - (Date.now() - lastTime), 0));
        }
    };
};

export function preloadImage(url: string) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
    });
}

// check if we're on mobile based on width/height/orientation
let mobile = false;
const portrait = window.matchMedia('(orientation: portrait)').matches;
const landscape = !portrait;
let w = window.innerWidth;
let h = window.innerHeight;

if (portrait) {
    let tmp = w;
    w = h;
    h = tmp;
}

mobile = !(w >= 1024 || h >= 768);
// if (!mobile) {
//     mobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//     console.log(mobile);
// }

if (w < h) mobile = true;

export function isMobile() {
    return mobile;
    // return window.innerWidth < window.innerHeight && window.innerHeight < 1080;

    // if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    // }
}

export function isDesktop() {
    return !isMobile();
}

export function isTouchDevice() {
    // @ts-ignore
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}

// detect browser (very cheap)
let is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
const is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
const is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
let is_safari = navigator.userAgent.indexOf('Safari') > -1;
const is_opera = navigator.userAgent.toLowerCase().indexOf('op') > -1;
if (is_chrome && is_safari) {
    is_safari = false;
}
if (is_chrome && is_opera) {
    is_chrome = false;
}

export function isSafari() {
    return is_safari;
}

export function capitalize(text: string) {
    return text.substring(0, 1).toUpperCase() + text.substring(1);
}

// const isArray = typeof Array.isArray === 'function' ? Array.isArray : (a) => a instanceof Array;
const isArray = Array.isArray;

function cloneRegExp(re: any) {
    let regexMatch = /^\/(.*)\/([gimyu]*)$/.exec(re.toString());
    // @ts-ignore
    return new RegExp(regexMatch[1], regexMatch[2]);
}

export function cloneObj(arg: any): any {
    if (typeof arg !== 'object') {
        return arg;
    }
    if (arg === null) {
        return null;
    }
    if (isArray(arg)) {
        return arg.map(cloneObj);
    }
    if (arg instanceof Date) {
        return new Date(arg.getTime());
    }
    if (arg instanceof RegExp) {
        return cloneRegExp(arg);
    }

    let cloned: any = {};
    for (let name in arg) {
        if (Object.prototype.hasOwnProperty.call(arg, name)) {
            cloned[name] = cloneObj(arg[name]);
        }
    }

    return cloned;
}

export function isAncestorOf(elt: HTMLElement | null, ancestor: HTMLElement | null) {
    while (elt && ancestor) {
        elt = elt.parentElement;
        if (elt === ancestor) return true;
    }

    return false;
}

export function isElementInViewY(elt: Element) {
    const rect = elt.getBoundingClientRect();

    if (rect.top + rect.height < 0) return false;
    if (rect.top > window.innerHeight) return false;

    return true;
}

export function hexToRgb(hex: string) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return {
        r: parseInt(result![1], 16),
        g: parseInt(result![2], 16),
        b: parseInt(result![3], 16),
    };
}
