// eslint-disable-next-line @typescript-eslint/max-len
// eslint-disable-next-line max-classes-per-file
import { scene, spawner } from '../App';
import * as gv from '../Utils/gameValues';
import { Utils } from '../Utils/utils';

// eslint-disable-next-line import/prefer-default-export
export abstract class Enemy extends Phaser.GameObjects.Sprite {
    public ID: string;
    private currentSpeed = gv.INITIAL_SPEED + 1;

    constructor(config: { x: number; y: number; imageName: string | Phaser.Textures.Texture; currentSpeed: number; carFrame: number}) {
        super(scene, config.x, config.y, config.imageName, config.carFrame);

        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
        scene.add.existing(this).setDepth(1).setOrigin(0, 0);

        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.ID = Utils.generateId();
        this.currentSpeed = config.currentSpeed;

        scene.enemiesGroup.add(this);
    }

    public update() {
        this.y += this.currentSpeed;
        if (this.y >= gv.CANVAS.HEIGHT) {
            this.delete();
        }
    }

    public delete() {        
        new Explosion({ x: this.x, y: this.y });
        spawner.deleteEnemy(this.ID);
        this.destroy();
    }
}

export class Explosion extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(scene, config.x, config.y + 25, 'explosionSS');
        scene.anims.create({
            key: 'explosion',
            frames: this.anims.generateFrameNumbers('explosionSS', { start: 0, end: 5 }),
            duration: 800,
            repeat: false
        });

        this.once('animationcomplete', () => this.destroy() );

        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
        scene.add.existing(this).setDepth(1).setOrigin(0, 0);

        scene.physics.world.enable(this);
        scene.add.existing(this);

        this.play('explosion'); 
    }
}