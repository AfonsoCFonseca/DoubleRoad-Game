import { scene } from '../App';
import { Position, SIDE } from '../game.interfaces';
import * as consts from './gameValues';

// eslint-disable-next-line import/prefer-default-export
export class Utils {
    public static halfScreenBackground = (axis: 'x' | 'y', edge: boolean | null = null): number => { 
        if (axis === 'x') return !edge ? (consts.CANVAS.WIDTH / 2) - (consts.BACKGROUND.WIDTH / 2) : (consts.CANVAS.WIDTH / 2) + (consts.BACKGROUND.WIDTH / 2);
        return !edge ? (consts.CANVAS.HEIGHT / 2) - (consts.BACKGROUND.HEIGHT / 2) : (consts.CANVAS.HEIGHT / 2) + (consts.BACKGROUND.HEIGHT / 2);
    };

    public static halfScreen = (axis: 'x' | 'y', objectSize: number): number => { 
        if (axis === 'x') return (consts.CANVAS.WIDTH / 2) - objectSize;
        return (consts.CANVAS.HEIGHT / 2) - (objectSize / 2);
    };

    public static makeAnimation = (target: Phaser.GameObjects.Image, { x, y }:Position, duration:number, callback: { (): void; (): void; (): void; }) => scene.tweens.add({
        targets: target,
        x,       
        y,
        ease: 'Linear',     
        duration,
        repeat: 0,
        onComplete() {
            callback();
        }
    });

    public static rndNumber(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public static generateId(): string {
        return `_${Math.random().toString(36).substr(2, 9)}`;
    }

    public static getSide(x: number):SIDE {
        return x >= 700 ? 'right' : 'left';
    }

    public static isMobile() {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        }
        return false;
    }

    public static setCookie(cname: string, cvalue: string, exdays: number) {
        const d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        const expires = `expires=${d.toUTCString()}`;
        document.cookie = `${cname}=${cvalue};${expires};SameSite=None; Secure;path=/`;
    }
    
    public static getCookie(cname: string) {
        const name = `${cname}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    }

    public static requestBE({ type, url, obj }:{ type:string, url:string, obj?:any }) {
        return new Promise((resolve) => {
            setTimeout(
                () => {
                    $.ajax({
                        type,
                        url,
                        data: type === 'POST' ? obj : null,
                        success: (result) => {
                            if (result.status === 200) {
                                resolve(result.obj);
                            } else {
                                resolve(null);
                                console.log('DB failed');
                            }
                        }
                    });
                }, 
                Math.floor(Math.random() * 100) + 1
            );
        });
    }

    public static formatUserNameToBoard(str:string, length?:number): string {
        const substringNum = length || 13;
        return str.substr(0, substringNum) + (str.length >= substringNum ? '..' : '');
    }
}

// function axios(arg0: { method: string; url: string; data: { firstName: string; lastName: string; }; }) {
//     throw new Error("Function not implemented.");
// }

