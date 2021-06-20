import { Utils } from "../Utils/utils";
import { scene } from "../App";
import * as gv from "../Utils/gameValues"

export class Map {

    overlayImage;
    overlayImage1;
    private currentSpeed = gv.INITIAL_SPEED;

    constructor(){
        scene.add.image( Utils.halfScreenBackground('x') , Utils.halfScreenBackground('y'), 'background').setOrigin(0, 0);
        this.overlayImage = scene.add.image( Utils.halfScreenBackground('x') ,0, 'background_overlay').setOrigin(0, 0);
        this.overlayImage1 = scene.add.image( Utils.halfScreenBackground('x') , -gv.BACKGROUND.HEIGHT, 'background_overlay').setOrigin(0, 0);
    }

    move(){
        this.overlayImage.y = this.overlayImage.y + this.currentSpeed;
        this.overlayImage1.y = this.overlayImage1.y + this.currentSpeed;

        if( this.overlayImage.y >= gv.BACKGROUND.HEIGHT ){
            let diff = gv.BACKGROUND.HEIGHT - this.overlayImage.y 
            this.createNewOverlay(diff)
        }
    }

    public setMapSpeed( newSpeed: number ){
        this.currentSpeed =  newSpeed;
    }

    createNewOverlay(diff:number){
        this.overlayImage.destroy()
        this.overlayImage = this.overlayImage1
        this.overlayImage1 = scene.add.image( Utils.halfScreenBackground('x') , -gv.BACKGROUND.HEIGHT - diff, 'background_overlay').setOrigin(0, 0);
        if( scene.currentLevel <= 70)
            this.currentSpeed += 0.2;
    }

    // public getCarPosition(side: 'left'| 'right'):Position{
    //     if( side == 'left' ){
    //         return { x:  (gv.CANVAS.WIDTH / 2) + (-gv.CAR.POSITION_1), y: 120}
    //     }
    //     else {
    //         return { x:  (gv.CANVAS.WIDTH / 2) + gv.CAR.POSITION_1 - gv.CAR.WIDTH, y: 120}
    //     }
    // }

}