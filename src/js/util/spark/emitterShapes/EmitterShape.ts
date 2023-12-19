import { Particle } from '../Particle';

export type EmitterShape = {
    init(particle: Particle): void;
};
