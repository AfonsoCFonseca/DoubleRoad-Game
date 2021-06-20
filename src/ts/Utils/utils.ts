import { scene } from "../App"
import { Position } from "../game.interfaces"
import * as consts from "./gameValues"

export class Utils {

    public static halfScreenBackground = ( axis: 'x' | 'y', edge: boolean | null = null ): number => { 
        if( axis == 'x' ) return !edge ? (consts.CANVAS.WIDTH / 2) - (consts.BACKGROUND.WIDTH / 2) : (consts.CANVAS.WIDTH / 2) + (consts.BACKGROUND.WIDTH / 2)
        else return !edge ? (consts.CANVAS.HEIGHT / 2) - (consts.BACKGROUND.HEIGHT / 2) : (consts.CANVAS.HEIGHT / 2) + (consts.BACKGROUND.HEIGHT / 2)
    }

    public static halfScreen = ( axis: 'x' | 'y', objectSize: number ): number => { 
        if( axis == 'x' ) return (consts.CANVAS.WIDTH / 2) - objectSize
        else return (consts.CANVAS.HEIGHT / 2) - (objectSize / 2)
    }

    public static makeAnimation = (target, { x, y }:Position, duration:number, callback) => {
        return scene.tweens.add({
            targets: target,
            x,       
            y,
            ease: 'Linear',     
            duration,
            repeat: 0,
            onComplete: function () {
                callback()
            },
        });
    }

    public static rndNumber(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public static generateId(): string {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    public static getSide(x: number):'right'| 'left'{
        return x >= 700 ? 'right' : 'left'
    }


    public static isMobile(){
        if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
            return true
          }else{
            return false
          }
    }
}