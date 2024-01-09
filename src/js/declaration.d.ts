// declaration.d.ts
declare module '*.scss';
declare module '*.module';
declare module '!!*';
declare module '*.glsl';
declare module '*.png';
declare module '*.svg';
declare module '*.drc';

interface Window {
    globals: any;
}

interface PowerRef {
    get: () => number;
    set: (power: number) => void;
}

interface AppData {
    events: EventData[];
}

interface EventData {
    title: string;
    type: string;
}
