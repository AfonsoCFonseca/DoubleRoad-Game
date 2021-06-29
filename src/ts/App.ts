import 'phaser';
import { Map } from './Map/Map';
import * as gv from './Utils/gameValues';
import RightCar from './Player/RightCar';
import LeftCar from './Player/LeftCar';
import { EnemySpawner } from './Enemies/EnemySpawner';
import { GAME_STATE, SIDE } from './game.interfaces';
import { Utils } from './Utils/utils';

export let map: Map;
export let spawner: EnemySpawner;
export let scene: any;

export class GameScene extends Phaser.Scene {
    private playerCarsGroup: Phaser.GameObjects.Group;
    private enemiesGroup: Phaser.GameObjects.Group;
    private startUI: Phaser.GameObjects.Group;
    private menuGameOver: Phaser.GameObjects.Group;
    private startScreenImg: Phaser.GameObjects.Image;
    private tutorial: Phaser.GameObjects.Image;
    private startScreenImgInitialY: number;
    private startScreenImgGoingUp: boolean = false;
    private startScreenImgFinallY: number = -8;

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
    private highScore = parseInt(Utils.getCookie('highscore'), 10) || 0;
    private lifesImageArray = [];
    private lifes: number;

    private currentLevelDraw;

    constructor() {
        super({});

        this.carCrash = this.carCrash.bind(this);
    }

    preload() {
        this.load.image('background_overlay', 'assets/background_overlay2.png');
        this.load.image('GameOverScreen', 'assets/gameOverScreen.png');
        this.load.image('RetryButton', 'assets/RetryButton.png');
        this.load.image('StartScreenImg', 'assets/StartingScreen.png');
        this.load.image('Tutorial', 'assets/tutorial.png');
        this.load.image('UIScoringScreen', 'assets/UIScoringScreen.png');
        this.load.image('carIcon', 'assets/carIcon.png');
        this.load.image('PauseButton', 'assets/pauseButton.png');
        
        this.load.spritesheet('cars_sheet', 'assets/cars_sheet.png', {
            frameWidth: gv.CAR.WIDTH,
            frameHeight: gv.CAR.HEIGHT
        });

        this.load.spritesheet('explosionSS', 'assets/explosion.png', {
            frameWidth: gv.CAR.WIDTH,
            frameHeight: gv.CAR.HEIGHT
        });

        this.load.spritesheet('lifebar', 'assets/lifebar.png', {
            frameWidth: 45,
            frameHeight: 22
        });

        this.load.spritesheet('carMov', 'assets/car1_anim_mov1.png', {
            frameWidth: gv.CAR.WIDTH,
            frameHeight: gv.CAR.HEIGHT
        });

        this.menuGameOver = this.add.group();

        GameScene.loadPositionOnScreen();

        this.playerCarsGroup = this.add.group();
        this.enemiesGroup = this.add.group();
        this.startUI = this.add.group();

        scene = this;
    }

    create() {
        this.state = GAME_STATE.START;
        this.setKeys();
        this.showStartingScreen();
        map = new Map();
    }

    startGame() {
        this.tutorial.destroy();
        this.state = GAME_STATE.RUNNING;
        this.currentSpeed = gv.INITIAL_SPEED;
        this.currentGap = gv.INITIAL_GAP;
        this.lifes = gv.INITIAL_LIFES;
        this.createPlayer();
        spawner = new EnemySpawner();

        this.levelUpTimer();
        this.score = GameScene.makeScoreMath(this.currentLevel);
        this.showUI();

        this.physics.add.collider(this.enemiesGroup, this.playerCarsGroup, this.carCrash);

        this.input.addPointer(3);
    }

    update() {
        if (this.state === GAME_STATE.RUNNING) {
            spawner.currentEnemies.forEach((enemy) => enemy.update());
            map.move();
        }
        this.keys();
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
        window.addEventListener('keyup', () => {
            if (this.state === GAME_STATE.START) {
                this.showTutorial();
            }
        }, false);

        scene.input.on('pointerup', () => {
            if (this.state === GAME_STATE.START) {
                this.showTutorial();
            }
        });

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

    changeTrack(side: SIDE) {
        const currentCar = side === 'left' ? this.leftCar : this.rightCar;
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
            this.lifesImageArray[this.lifes].visible = false;
        } else {
            this.gameOver();
        } 
    }

    levelUp() {
        this.currentLevel += 1;
        this.score = GameScene.makeScoreMath(this.currentLevel);
        this.currentLevelDraw.setText(`Score:${this.score}`);

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
        this.lifesImageArray.forEach((lifeImg, index) => this.lifesImageArray[index].visible = true);
        this.leftCar.setToInitialPosition();
        this.rightCar.setToInitialPosition();
        map.setMapSpeed(gv.INITIAL_SPEED);
        spawner.clearAllEnemies();
        this.score = 0;
        this.menuGameOver.clear(true, true);
        this.state = GAME_STATE.RUNNING;
        spawner.createEnemy();
        this.levelUpTimer();
        this.currentLevelDraw.setText(`Score:${this.score}`);
    }

    checkHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            Utils.setCookie('highscore', this.highScore.toString(), 1);
        }
    }

    showUI() {
        this.currentLevelDraw = this.add.text(5, 45, `Score:${this.score}`, {
            fontSize: '16px'
        }).setDepth(1.1);

        const firstLifeImage1 = this.add.image(23, 10, 'lifebar', 0).setDepth(2).setOrigin(0, 0);
        const secondLifeImage1 = this.add.image(68, 10, 'lifebar', 1).setDepth(2).setOrigin(0, 0);
        this.lifesImageArray.push(firstLifeImage1);
        this.lifesImageArray.push(secondLifeImage1);

        this.add.image(23, 10, 'lifebar', 2).setDepth(1.5).setOrigin(0, 0);
        this.add.image(68, 10, 'lifebar', 3).setDepth(1.5).setOrigin(0, 0);

        this.add.image(0, 0, 'UIScoringScreen').setDepth(1).setOrigin(0, 0);
        this.add.image(5, 8, 'carIcon').setDepth(1).setOrigin(0, 0);

        this.add.image(960, 50, 'PauseButton').setDepth(1).setOrigin(0, 0);
    }

    showStartingScreen() {
        const startingScreenImgWidth = 920;
        const startingScreenX = gv.BACKGROUND.WIDTH / 2 - startingScreenImgWidth / 2;
        const startingScreenY = gv.BACKGROUND.WIDTH / 2 - 200;
        this.startScreenImgInitialY = startingScreenY;
        this.startScreenImg = this.add.image(startingScreenX, startingScreenY, 'StartScreenImg').setDepth(1).setOrigin(0, 0);

        const startGameText = this.add.text(gv.BACKGROUND.WIDTH / 2, (gv.CANVAS.HEIGHT / 2) + 80, 'start game', {
            font: '60px Geneva',
            align: 'center' // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
        }).setDepth(1.1);

        startGameText.x -= startGameText.width / 2;
        this.startUI.add(startGameText);
        this.startUI.add(this.startScreenImg);

        this.movementTitleScreen();
    }

    showTutorial() {
        this.state = GAME_STATE.TUTORIAL;
        this.startUI.clear(true, true);
        const imageHeight = 246;
        const yPosition = gv.CANVAS.HEIGHT / 2 - imageHeight / 2;
        this.tutorial = this.add.image(0, yPosition, 'Tutorial').setDepth(1).setOrigin(0, 0);
        setTimeout(() => {
            this.startGame();
        }, 2000);
    }

    movementTitleScreen() {
        Utils.makeAnimation(this.startScreenImg, { x: this.startScreenImg.x, y: this.startScreenImgInitialY + this.startScreenImgFinallY }, 1000, () => {
            this.startScreenImgFinallY = this.startScreenImgGoingUp ? -8 : 8;
            this.startScreenImgGoingUp = !this.startScreenImgGoingUp;
            this.movementTitleScreen();
        });
    }

    gameOver() {
        this.state = GAME_STATE.GAME_OVER;
        const backgroundGameOverWidth = 600;
        const backgroundGameOverHeight = 800;
        const backgroundGamoOverX = (gv.CANVAS.WIDTH / 2) - backgroundGameOverWidth / 2;
        const backgroundGamoOverY = (gv.CANVAS.HEIGHT / 2) - backgroundGameOverHeight / 2;

        this.checkHighScore();

        const gameOverScreen = this.add.image(backgroundGamoOverX, backgroundGamoOverY, 'GameOverScreen').setDepth(1).setOrigin(0, 0);

        const scoretext1 = this.add.text(gv.BACKGROUND.WIDTH / 2, backgroundGamoOverY + 250, `${this.score}`, {
            font: '50px Geneva',
            align: 'center' // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
        }).setDepth(1.1);

        scoretext1.x -= scoretext1.width / 2;

        const highScoretext1 = this.add.text(gv.BACKGROUND.WIDTH / 2, backgroundGamoOverY + 420, `${this.highScore}`, {
            font: '50px Geneva',
            align: 'center' // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
        }).setDepth(1.1);

        highScoretext1.x -= highScoretext1.width / 2;

        const buttonWidth = 412;
        const calcX = (backgroundGameOverWidth - buttonWidth) / 2;
        const btnRetry = this.add.image(backgroundGamoOverX + calcX, backgroundGamoOverY + 540, 'RetryButton').setOrigin(0, 0).setDepth(1.1);
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

export const config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: 1080,
        height: 1920,
        backgroundColor: '#000000'
    },
    input: {
        activePointers: 2
    },
    physics: {
        default: 'arcade',
        arcade: {
        //debug: true,
        }
    },
    scene: GameScene
};

export const game = new Phaser.Game(config);
