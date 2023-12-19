import { Particle } from '../Particle';
import { EmitterShape } from './EmitterShape';

export class PointEmitterShape implements EmitterShape {
    x: number;
    y: number;
    z: number;

    /**
     * Emit from a point
     * @param x 
     * @param y 
     * @param z 
     */
    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    init(particle: Particle): void {
        particle.position.x = this.x;
        particle.position.y = this.y;
        particle.position.z = this.z;
    }
}
