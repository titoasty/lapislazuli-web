import { EmitterDelay } from './EmitterDelay';

export class RandomEmitterDelay implements EmitterDelay {
    min: number;
    max: number;

    /**
     * Emit particles at a random delay
     * You can omit max if you want a fixed delay between particles
     * @param min min delay in seconds
     * @param max max delay in seconds
     */
    constructor(min: number, max?: number) {
        this.min = min;
        this.max = max || min;
    }

    next(): number {
        return this.min + (this.max - this.min) * Math.random();
    }
}
