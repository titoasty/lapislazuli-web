import { Behaviour } from './behaviours/Behaviour';
import { LifeBehaviour } from './behaviours/LifeBehaviour';
import { EmitterDelay } from './emitterDelays/EmitterDelay';
import { RandomEmitterDelay } from './emitterDelays/RandomEmitterDelay';
import { EmitterShape } from './emitterShapes/EmitterShape';
import { PointEmitterShape } from './emitterShapes/PointEmitterShape';
import { Particle } from './Particle';

export interface SparkOptions {
    /**
     * Automatically starts emitting at creation
     */
    autoStart?: boolean;
    /**
     * Automatically updates particles, otherwise you must manually call update(delta)
     */
    autoUpdate?: boolean;
    /**
     * Automatically emits particles
     */
    autoEmit?: boolean;
    /**
     * Max number of particles
     */
    maxParticles?: number;
    /**
     * Delay between particles
     */
    emitterDelay: EmitterDelay;
    /**
     * Shape of the emitter
     */
    emitterShape: EmitterShape;
    /**
     * Behaviours applied on particles
     */
    behaviours: Behaviour[];
    /**
     * Called each time a particle is emitted
     * @param particle 
     * @returns 
     */
    onEmitParticle?: (particle: Particle) => void;
    /**
     * Called each time a particle is destroyed
     * @param particle 
     * @returns 
     */
    onDestroyParticle?: (particle: Particle) => void;
    /**
     * Called each frame for each particles
     * @param particle 
     * @returns 
     */
    onUpdateParticle?: (particle: Particle) => void;
}

interface SparkBurst {
    time: number;
    delays: number[];
}

export class Spark {
    emitting: boolean = false;
    particles: Particle[] = [];
    emitterDelay: EmitterDelay;
    emitterShape: EmitterShape;
    behaviours: Behaviour[] = [];

    autoUpdate: boolean;
    autoEmit: boolean;
    maxParticles: number;

    // events
    onEmitParticle?: (particle: Particle) => void;
    onDestroyParticle?: (particle: Particle) => void;
    onUpdateParticle?: (particle: Particle) => void;

    private _time: number = 0;
    private _emitDelay: number = 0;
    private _prevTimestamp: number | undefined;
    private _rafID: number = -1;

    private _recycled: Particle[] = [];

    private _bursts: SparkBurst[] = [];

    constructor(options?: SparkOptions) {
        const myOptions = {
            autoStart: true,
            autoUpdate: true,
            autoEmit: true,
            maxParticles: 100,
            emitterDelay: new RandomEmitterDelay(1, 2),
            emitterShape: new PointEmitterShape(),
            behaviours: [new LifeBehaviour(1, 2)],
            ...options,
        };

        this.autoUpdate = myOptions.autoUpdate;
        this.autoEmit = myOptions.autoEmit;
        this.maxParticles = myOptions.maxParticles;
        this.emitterDelay = myOptions.emitterDelay;
        this.emitterShape = myOptions.emitterShape;
        this.behaviours = myOptions.behaviours;
        this.onEmitParticle = myOptions.onEmitParticle;
        this.onDestroyParticle = myOptions.onDestroyParticle;
        this.onUpdateParticle = myOptions.onUpdateParticle;

        // auto-start
        if (myOptions.autoStart) {
            this.start();
        }
    }

    start() {
        this.emitting = true;

        this._time = 0;
        this._emitDelay = this.emitterDelay.next();

        // auto-update
        if (this.autoUpdate) {
            this._rafID = requestAnimationFrame(this._autoUpdate.bind(this));
        }
    }

    pause() {
        this.emitting = false;
    }

    resume() {
        this.emitting = true;
    }

    stop(destroyAllNow: boolean = false) {
        this.emitting = false;

        // destroy all particles now
        if (destroyAllNow) {
            cancelAnimationFrame(this._rafID);
            this._rafID = -1;

            for (const particle of this.particles) {
                this._recycled.push(particle);
                this.onDestroyParticle?.(particle);
            }

            this.particles = [];
        }
    }

    destroy() {
        this.stop();

        cancelAnimationFrame(this._rafID);
    }

    /**
     * Emit a certain number of particles with a delay coming from emitterDelay
     * @param nb number of particles to emit
     * @param emitterDelay delay between particles
     */
    burst(nb: number, emitterDelay?: EmitterDelay) {
        const delays: number[] = [];

        if (!emitterDelay) {
            emitterDelay = this.emitterDelay;
        }

        while (nb-- > 0) {
            delays.push(emitterDelay.next());
        }

        this._bursts.push({
            time: 0,
            delays,
        });
    }

    emit(nb: number) {
        while (nb-- > 0 && this.particles.length < this.maxParticles) {
            const particle = this._recycled.length > 0 ? this._recycled.pop()! : new Particle();

            // reset particle
            particle.dead = false;
            particle.data = {};

            this.emitterShape.init(particle);

            // initialize behaviours
            for (const behaviour of this.behaviours) {
                behaviour.init(particle);
            }

            this.particles.push(particle);

            this.onEmitParticle?.(particle);
            this.onUpdateParticle?.(particle);
        }
    }

    _autoUpdate(timestamp: number) {
        // compute delta
        if (!this._prevTimestamp) {
            this._prevTimestamp = timestamp;
        }
        const delta = (timestamp - this._prevTimestamp) / 1000;
        this._prevTimestamp = timestamp;

        this.update(delta);

        this._rafID = requestAnimationFrame(this._autoUpdate.bind(this));
    }

    update(delta: number) {
        // update particles
        let i = this.particles.length;
        while (i-- > 0) {
            const particle = this.particles[i];

            // apply behaviours
            for (const behaviour of this.behaviours) {
                behaviour.update(particle, delta);
            }

            // particle is dead
            if (particle.dead) {
                this.particles.splice(i, 1);
                // this._recycled.push(particle);
                this.onDestroyParticle?.(particle);
                continue;
            }

            // update position
            particle.position.x += particle.velocity.x * delta;
            particle.position.y += particle.velocity.y * delta;
            particle.position.z += particle.velocity.z * delta;

            this.onUpdateParticle?.(particle);
        }

        let nbToEmit = 0;

        if (this.autoEmit && this.emitting) {
            // emit new particles
            this._time += delta;

            while (this._time >= this._emitDelay) {
                this._time -= this._emitDelay;

                // next emit delay
                this._emitDelay = this.emitterDelay.next();

                nbToEmit++;
            }
        }

        let burstIdx = this._bursts.length;
        while (burstIdx-- > 0) {
            const burst = this._bursts[burstIdx];

            burst.time += delta;

            while (burst.delays.length > 0 && burst.time > burst.delays[0]) {
                burst.time -= burst.delays.shift()!;

                nbToEmit++;
            }

            // no more particles to emit from this burst, remove it
            if (burst.delays.length <= 0) {
                this._bursts.splice(burstIdx, 1);
            }
        }

        if (nbToEmit > 0) {
            this.emit(nbToEmit);
        }
    }
}
