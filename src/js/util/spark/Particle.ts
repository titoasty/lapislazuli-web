export class Particle {
    // life
    dead: boolean = false;
    maxLife: number = 0;
    life: number = 0;
    lifeRatio: number = 0;

    // position
    position = {
        x: 0,
        y: 0,
        z: 0,
    };
    velocity = {
        x: 0,
        y: 0,
        z: 0,
    };

    data: {
        [key: string]: any;
    } = {};
}
