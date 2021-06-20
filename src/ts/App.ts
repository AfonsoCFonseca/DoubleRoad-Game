import 'phaser'
import { Map } from './Map/Map';
import * as gv from './Utils/gameValues';
import { RightCar } from './Player/RightCar';
import { LeftCar } from './Player/LeftCar';
import { EnemySpawner } from './Enemies/EnemySpawner';
import { GAME_STATE } from './game.interfaces';

export let map: Map;
export let spawner: EnemySpawner;
export let scene: any;

export class GameScene extends Phaser.Scene {
    private playerCarsGroup: Phaser.GameObjects.Group;
    private enemiesGroup: Phaser.GameObjects.Group;
    private menuGameOver: Phaser.GameObjects.Group;

    public leftCar: LeftCar;
    public rightCar: RightCar;

    public state: GAME_STATE;

    private moveKeys;

    private currentLevel = 1;
    private currentSpeed: number;
    private inbetweenSpeed = 0.2;
    private currentGap: number;
    private inbetweenGap = 30;
    private score = 0;
    private highScore = 0;
    private lifesImageArray = [];
    private lifes: number;

    private currentLevelDraw;

    constructor() {
        super({});

        this.carCrash = this.carCrash.bind(this);
    }

    preload() {
        this.load.image('background', 'assets/background1.jpg');
        this.load.image('background_overlay', 'assets/background_overlay1.png');
        this.load.image('normal_car_1', 'assets/normal_car_1.png');
        this.load.image('normal_car_2', 'assets/normal_car_2.png');
        this.load.image('normal_car_3', 'assets/normal_car_3.png');
        this.load.image('normal_car_4', 'assets/normal_car_4.png');
        this.load.image('normal_car_5', 'assets/normal_car_5.png');
        this.load.image('GameOverScreen', 'assets/gameOverScreen.png');
        this.load.image('RetryButton', 'assets/RetryButton.png');
        
        this.load.spritesheet('explosionSS', 'assets/explosion.png', {
            frameWidth: gv.CAR.WIDTH,
            frameHeight: gv.CAR.HEIGHT
        });

        this.load.spritesheet('lifes', 'assets/lifes.png', {
            frameWidth: gv.CAR.WIDTH / 2,
            frameHeight: gv.CAR.HEIGHT / 2
        });

        this.load.spritesheet('carMov', 'assets/car1_anim_mov.png', {
            frameWidth: gv.CAR.WIDTH,
            frameHeight: gv.CAR.HEIGHT
        });

        this.menuGameOver = this.add.group();

        GameScene.loadPositionOnScreen();

        this.playerCarsGroup = this.add.group();
        this.enemiesGroup = this.add.group();

        scene = this;
    }

    create() {
        this.state = GAME_STATE.RUNNING;
        this.currentSpeed = gv.INITIAL_SPEED;
        this.currentGap = gv.INITIAL_GAP;
        this.lifes = gv.INITIAL_LIFES;
        map = new Map();
        this.createPlayer();
        spawner = new EnemySpawner();

        this.setKeys();
        this.levelUpTimer();
        this.score = GameScene.makeScoreMath(this.currentLevel);
        this.showUI();

        this.physics.add.collider(this.enemiesGroup, this.playerCarsGroup, this.carCrash);

        this.input.addPointer(3);

        scene.scale.lockOrientation('landscape');
    }

    update() {
        spawner.currentEnemies.forEach((enemy) => enemy.update());
        this.keys();

        map.move();
    }

    createPlayer() {
        let car = {
            spriteName: 'carIdleAnimation'
        };
        this.rightCar = new RightCar(car);
        car = {
            spriteName: 'carIdleAnimation'
        };
        this.leftCar = new LeftCar(car);
    }

    setKeys() {
        this.input.keyboard.createCursorKeys();

        this.moveKeys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.Q,
            right: Phaser.Input.Keyboard.KeyCodes.E
        });
    }

    keys() {
        window.addEventListener('keydown', () => {
            if (this.moveKeys.left.isDown) {
                this.changeTrack('left');
            }
            if (this.moveKeys.right.isDown) {
                this.changeTrack('right');
            }
        }, false);

        if (this.input.pointer1.isDown || this.input.pointer2.isDown) {
            let xPointer1; 
            let xPointer2;

            if (this.input.pointer1.isDown) {
                xPointer1 = this.input.pointer1.x;
            }
            if (this.input.pointer2.isDown) {
                xPointer2 = this.input.pointer2.x;
            }

            if (xPointer1 < gv.CANVAS.WIDTH / 2 || xPointer2 < gv.CANVAS.WIDTH / 2) {
                this.changeTrack('left');
            }

            if (xPointer1 >= gv.CANVAS.WIDTH / 2 || xPointer2 >= gv.CANVAS.WIDTH / 2) {
                this.changeTrack('right');
            }
        }
    }

    changeTrack(side: 'left' | 'right') {
        const currentCar = side === 'left' ? this.leftCar : this.rightCar
        if (currentCar.movementCooldownRdy) {
            this.time.delayedCall(gv.KEY_PRESSED_TIMER, () => {
                currentCar.movementCooldownRdy = true;
            }, [], this);

            currentCar.move();
            currentCar.movementCooldownRdy = false;
        }
    }

    public getSpeed(): number {
        return this.currentSpeed;
    }

    public getGap(): number {
        return this.currentGap;
    }

    public levelUpTimer() {
        setTimeout(() => {
            if (this.state === GAME_STATE.RUNNING) {
                this.levelUp();
                this.levelUpTimer();
            }
        }, gv.TIME_PER_LEVEL);
    }

    carCrash(enemy) {
        enemy.delete();
        this.lifes -= 1;
        if (this.lifes >= 0) {
            this.lifesImageArray[this.lifes].setTexture('lifes', 1);
        } else {
            this.gameOver();
        } 
    }

    levelUp() {
        this.currentLevel += 1;
        this.score = GameScene.makeScoreMath(this.currentLevel);
        this.currentLevelDraw.setText(`Score: ${this.score}`);

        // eslint-disable-next-line default-case
        switch (this.currentLevel) {
            case 10:
                this.inbetweenGap = 30;
                break;
            case 20:
                this.inbetweenGap = 15;
                this.inbetweenSpeed = 0.1;
                break;
            case 30:
                this.inbetweenGap = 10;
                break;
        }

        this.currentSpeed += this.inbetweenSpeed;
        if (this.currentLevel < 50) {
            this.currentGap -= this.inbetweenGap;
        }
    }

    static makeScoreMath(level: number):number {
        return level * 100;
    }

    resetGame() {
        this.currentLevel = 1;
        this.lifes = gv.INITIAL_LIFES;
        this.currentSpeed = gv.INITIAL_SPEED;
        this.currentGap = gv.INITIAL_GAP;
        this.lifesImageArray.forEach((lifeImg, index) => this.lifesImageArray[index].setTexture('lifes', 0));
        this.leftCar.setToInitialPosition();
        this.rightCar.setToInitialPosition();
        map.setMapSpeed(gv.INITIAL_SPEED);
        spawner.clearAllEnemies();
        this.resetScore();
        this.menuGameOver.clear(true, true);
        this.state = GAME_STATE.RUNNING;
        spawner.createEnemy();
        this.levelUpTimer();
        this.currentLevelDraw.setText(`Score: ${this.score}`);
    }

    resetScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        this.score = 0;
    }

    showUI() {
        this.currentLevelDraw = this.add.text(20, 15, `Score: ${this.score}`, {
            fontSize: '30px'
        }).setDepth(1.1);

        const firstLifeImage = this.add.image(20, 50, 'lifes', 0).setDepth(1).setOrigin(0, 0);
        const secondLifeImage = this.add.image(60, 50, 'lifes', 0).setDepth(1).setOrigin(0, 0);
        this.lifesImageArray.push(firstLifeImage);
        this.lifesImageArray.push(secondLifeImage);
    }

    gameOver() {
        this.state = GAME_STATE.GAME_OVER;
        const backgroundGameOverWidth = 300;
        const backgroundGameOverHeight = 400;
        const backgroundGamoOverX = (game.canvas.width / 2) - backgroundGameOverWidth / 2;
        const backgroundGamoOverY = (game.canvas.height / 2) - backgroundGameOverHeight / 2;

        const gameOverScreen = this.add.image(backgroundGamoOverX, backgroundGamoOverY, 'GameOverScreen').setDepth(1).setOrigin(0, 0);

        const scoretext1 = this.add.text(backgroundGamoOverX + 170, backgroundGamoOverY + 135, `${this.score}`, {
            fontSize: '30px'
        }).setDepth(1.1);

        const highScoretext1 = this.add.text(backgroundGamoOverX + 170, backgroundGamoOverY + 190, `${this.highScore}`, {
            fontSize: '30px'
        }).setDepth(1.1);

        const buttonWidth = 225;
        const calcX = (backgroundGameOverWidth - buttonWidth) / 2;
        const btnRetry = this.add.image(backgroundGamoOverX + calcX, backgroundGamoOverY + 270, 'RetryButton').setOrigin(0, 0).setDepth(1.1);
        btnRetry.setInteractive({ useHandCursor: true });
        btnRetry.setInteractive({ useHandCursor: true });
        btnRetry.on('pointerup', () => this.resetGame());

        this.menuGameOver.addMultiple([gameOverScreen, highScoretext1, scoretext1, btnRetry]);
    }

    static loadPositionOnScreen() {
        gv.CANVAS.WIDTH = game.canvas.width;
        gv.CANVAS.HEIGHT = game.canvas.height;
    }
}

export var config = {
  type: Phaser.AUTO,
  scale: {
    mode: Phaser.Scale.FIT,
    parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: 800,
    height: 600
  },
  input: {
    activePointers: 2,
  },
  physics: {
    default: "arcade",
    arcade: {
      //debug: true,
    }
  },
  scene: GameScene,
};

export let game = new Phaser.Game(config);
