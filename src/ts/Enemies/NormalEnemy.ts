import { Enemy } from './Enemy'
import * as gv from '../Utils/gameValues';
import { scene } from '../App';
import { Utils } from '../Utils/utils';

export default class NormalEnemy extends Enemy {
    constructor(config: { x: number; y: number }) {
        const normalCarConfig = { 
            ...config,
            imageName: 'cars_sheet',
            carFrame: Math.floor(Utils.rndNumber(1, 7)),
            currentSpeed: gv.INITIAL_SPEED + scene.getSpeed()
        };
        super(normalCarConfig);
    }
}
