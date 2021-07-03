import { scene } from '../App';
import { Utils } from '../Utils/utils';
import { GAME_STATE } from '../game.interfaces';
import { Enemy } from './Enemy';
import NormalEnemy from './NormalEnemy';

// eslint-disable-next-line import/prefer-default-export
export class EnemySpawner {
    public currentEnemies: Enemy[] = [];

    constructor() {
        this.createEnemy();
    }

    public createEnemy() {
        let rndPos = scene.leftCar.getBothPos()[Math.floor(Utils.rndNumber(0, 2))];
        let rndSmallSize = Utils.rndNumber(-10, -75);
        const currentLeftCar = new NormalEnemy({ x: rndPos, y: -200 + rndSmallSize }); 
        this.currentEnemies.push(currentLeftCar);

        rndSmallSize = Utils.rndNumber(-10, -75);
        rndPos = scene.rightCar.getBothPos()[Math.floor(Utils.rndNumber(0, 2))];
        const currentRightCar = new NormalEnemy({ x: rndPos, y: -200 + rndSmallSize }); 
        this.currentEnemies.push(currentRightCar);

        setTimeout(() => {
            if (scene.state === GAME_STATE.RUNNING) this.createEnemy();
        }, scene.getGap());
    }

    public clearAllEnemies() {
        this.currentEnemies.forEach((car) => {
            car.destroy();
        });
    }

    public deleteEnemy(id: string) {
        const filtered = this.currentEnemies.filter((enemy) => id !== enemy.ID);
        this.currentEnemies = filtered;
    }
}
