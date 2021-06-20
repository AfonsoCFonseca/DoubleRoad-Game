import Player from "./Player"
import * as gv from "../Utils/gameValues"

export class LeftCar extends Player {

    private pos1: number = (gv.CANVAS.WIDTH / 2) + gv.POSITION.LEFT_1
    private pos2: number = (gv.CANVAS.WIDTH / 2) + gv.POSITION.LEFT_2

    constructor(config){
        super(config)

        let pos = { 
            x: this.pos2,
            y: gv.CAR.Y_POSITION
        }
        config = { ...config, ...pos }
        super(config)
        
    }

    move(){
        super.move(this.pos1, this.pos2)
    }

    setToInitialPosition(){
        super.setToInitialPosition(this.pos2)
    }

    getBothPos(): number[]{
        return [this.pos1,this.pos2]
    }
}