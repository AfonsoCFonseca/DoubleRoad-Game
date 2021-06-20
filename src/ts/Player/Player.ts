import { Utils } from '../Utils/utils';
import { scene } from '../App';
import { PLAYER_STATE } from '../game.interfaces';

export default abstract class Player extends Phaser.GameObjects.Sprite {
    body!: Phaser.Physics.Arcade.Body;
    protected currentPos: 'pos1' | 'pos2' = 'pos2';
    protected nextX:number;
    public movementCooldownRdy = true;
    public state: PLAYER_STATE = PLAYER_STATE.IDLE;

    constructor(config:any) {
        super(scene, config.x, config.y, config.spriteName, 0);

        scene.physics.add.existing(this);
        scene.physics.world.enable(this);
        scene.add.existing(this).setDepth(1).setOrigin(0, 0);

        scene.physics.world.enable(this);
        scene.add.existing(this);

        scene.playerCarsGroup.add(this);

        this.nextX = this.x + 5;

        scene.anims.create({
            key: 'carIdleAnimation',
            frames: scene.anims.generateFrameNumbers('carMov', { end: 4 }),
            frameRate: 8,
            repeat: -1
        });

        scene.anims.create({
            key: 'carLeftAnimation',
            frames: scene.anims.generateFrameNumbers('carMov', { start: 5, end: 9 }),
            duration: 150,
            repeat: 0
        });
        
        scene.anims.create({
            key: 'carRightAnimation',
            frames: scene.anims.generateFrameNumbers('carMov', { start: 10, end: 14 }),
            duration: 150,
            repeat: 0
        });

        this.play('carIdleAnimation');
    }

    move(pos1: number, pos2: number) {
        this.state = PLAYER_STATE.MOVING;
        const x = this.currentPos === 'pos1' ? pos2 : pos1;
        const animationMovement = this.currentPos === 'pos1' ? 'carLeftAnimation' : 'carRightAnimation';

        this.play(animationMovement);
        this.once('animationcomplete', () => {
            this.play('carIdleAnimation');
        });

        Utils.makeAnimation(this, { x, y: this.y }, 150, () => {
            this.currentPos = this.currentPos === 'pos1' ? 'pos2' : 'pos1';
            this.state = PLAYER_STATE.IDLE;
            this.nextX = this.x;
        });
    }

    public setToInitialPosition(initialPos: number) {
        this.x = initialPos;
        this.nextX = this.x;
        this.currentPos = 'pos2';
    }
}
