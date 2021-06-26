import { Utils } from '../Utils/utils';
import { scene } from '../App';
import * as gv from '../Utils/gameValues';

// eslint-disable-next-line import/prefer-default-export
export class Map {
    overlayImage:Phaser.GameObjects.Image;
    overlayImage1:Phaser.GameObjects.Image;
    private currentSpeed = gv.INITIAL_SPEED;

    constructor() {
        this.overlayImage = scene.add.image(Utils.halfScreenBackground('x'), 0, 'background_overlay').setOrigin(0, 0);
        this.overlayImage1 = scene.add.image(Utils.halfScreenBackground('x'), -gv.BACKGROUND.HEIGHT, 'background_overlay').setOrigin(0, 0);
    }

    move() {
        this.currentSpeed = gv.INITIAL_SPEED + scene.getSpeed();
        this.overlayImage.y += this.currentSpeed + 1;
        this.overlayImage1.y += this.currentSpeed + 1;

        if (this.overlayImage.y >= gv.BACKGROUND.HEIGHT) {
            const diff = gv.BACKGROUND.HEIGHT - this.overlayImage.y; 
            this.createNewOverlay(diff);
        }
    }

    public setMapSpeed(newSpeed: number) {
        this.currentSpeed = newSpeed;
    }

    createNewOverlay(diff:number) {
        this.overlayImage.destroy();
        this.overlayImage = this.overlayImage1;
        this.overlayImage1 = scene.add.image(Utils.halfScreenBackground('x'), -gv.BACKGROUND.HEIGHT - diff, 'background_overlay').setOrigin(0, 0);
    }
}
