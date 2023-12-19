import { Particle } from '../Particle';
import { Behaviour } from './Behaviour';

export class ForceBehaviour implements Behaviour {
    fn: (() => { x: number; y: number; z: number }) | undefined;
    x: number;
    y: number;
    z: number;

    /**
     * Apply a random force at the creation of the particle
     * @param x direction on x
     * @param y direction on y
     * @param z direction on z
     */
    constructor(x: number | (() => { x: number; y: number; z: number }), y: number = 0, z: number = 0) {
        if (typeof x === 'function') {
            this.fn = x;
            this.x = 0;
        } else {
            this.x = x;
        }

        this.y = z;
        this.z = z;
    }

    init(particle: Particle): void {
        if (this.fn) {
            const { x, y, z } = this.fn();
            particle.velocity.x = x;
            particle.velocity.y = y;
            particle.velocity.z = z;
        } else {
            particle.velocity.x = this.x;
            particle.velocity.y = this.y;
            particle.velocity.z = this.z;
        }
    }

    update(particle: Particle, delta: number): void {
        // do nothing
    }
}
