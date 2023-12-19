import { Particle } from '../Particle';
import { Behaviour } from './Behaviour';

export class LifeBehaviour implements Behaviour {
    minLife: number;
    maxLife: number;

    /**
     * Life duration of a particle, between minLife and maxLife
     * You can omit maxLife for a fixed life duration
     * @param minLife min lfe
     * @param maxLife max life
     */
    constructor(minLife: number, maxLife?: number) {
        this.minLife = minLife;
        this.maxLife = maxLife || minLife;
    }

    init(particle: Particle) {
        particle.maxLife = this.minLife + (this.maxLife - this.minLife) * Math.random();
        particle.life = 0;
        particle.lifeRatio = 0;
    }

    update(particle: Particle, delta: number) {
        particle.life += delta;
        particle.lifeRatio = Math.max(0, Math.min(1, particle.life / particle.maxLife));

        if (particle.life >= particle.maxLife) {
            particle.dead = true;
        }
    }
}
