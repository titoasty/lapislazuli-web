import { Particle } from '../Particle';

export type Behaviour = {
    init(particle: Particle): void;
    update(particle: Particle, delta: number): void;
};
