import { Enemy } from './Enemy'
import * as gv from "../Utils/gameValues"
import { scene } from '../App';
import { Utils } from '../Utils/utils';

export class NormalEnemy extends Enemy {

    constructor(config) {
        const rnd = Math.floor( Utils.rndNumber(1,5) )
        config.imageName = `normal_car_${rnd}`;
        config.currentSpeed = gv.INITIAL_SPEED + scene.getSpeed();
        super(config);
    }
}
