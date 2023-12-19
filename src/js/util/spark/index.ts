// core
import { Spark, SparkOptions } from './Spark';

// behaviours
import { ForceBehaviour } from './behaviours/ForceBehaviour';
import { GravityBehaviour } from './behaviours/GravityBehaviour';
import { LifeBehaviour } from './behaviours/LifeBehaviour';

// shapes
import { RandomEmitterDelay } from './emitterDelays/RandomEmitterDelay';
import { PointEmitterShape } from './emitterShapes/PointEmitterShape';
export { Particle } from './Particle';

export const create = (options?: SparkOptions) => new Spark(options);

export const behaviour = {
    Life: LifeBehaviour,
    Force: ForceBehaviour,
    Gravity: GravityBehaviour,
};

export const emitterShape = {
    Point: PointEmitterShape,
};

export const emitterDelay = {
    Random: RandomEmitterDelay,
};
