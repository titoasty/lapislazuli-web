import { Particle } from '../Particle';
import { Behaviour } from './Behaviour';

export class GravityBehaviour implements Behaviour {
    x: number;
    y: number;
    z: number;

    /**
     * Apply a constant gravity
     * @param x direction on x
     * @param y direction on y
     * @param z direction on z
     */
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    init(particle: Particle): void {}

    update(particle: Particle, delta: number): void {
        particle.velocity.x += this.x * delta;
        particle.velocity.y += this.y * delta;
        particle.velocity.z += this.z * delta;
    }
}
