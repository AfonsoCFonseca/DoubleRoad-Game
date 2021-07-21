import 'phaser';
import { Map } from './Map/Map';
import * as gv from './Utils/gameValues';
import RightCar from './Player/RightCar';
import LeftCar from './Player/LeftCar';
import LeaderBoard from './LeaderBoard/LeaderBoard';
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
    private menuPause: Phaser.GameObjects.Group;
    private startScreenImg: Phaser.GameObjects.Image;
    private tutorial: Phaser.GameObjects.Image;
    private startScreenImgInitialY: number;
    private startScreenImgGoingUp: boolean = false;
    private startScreenImgFinallY: number = -8;

    public leftCar: LeftCar;
    public rightCar: RightCar;
    public leaderBoard: LeaderBoard;

    public state: GAME_STATE;

    private moveKeys;

    private playerKey: string;
    private currentLevel = 1;
    private currentSpeed: number;
    private inbetweenSpeed = 0.4;
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
        this.load.image('background_overlay', 'assets/background_overlay2.png');
        this.load.image('GameOverScreen', 'assets/gameOverScreen.png');
        this.load.image('UserBoard', 'assets/UserBoard.png');
        this.load.image('UserBoardPlayer', 'assets/UserBoardPlayer.png');
        this.load.image('RetryButton', 'assets/RetryButton.png');
        this.load.image('StartScreenImg', 'assets/StartingScreen.png');
        this.load.image('Tutorial', 'assets/tutorial.png');
        this.load.image('UIScoringScreen', 'assets/UIScoringScreen.png');
        this.load.image('carIcon', 'assets/carIcon.png');
        this.load.image('PauseButton', 'assets/pauseButton.png');
        this.load.image('BtnEdit', 'assets/btnEdit.png');
        this.load.image('pauseBG', 'assets/pauseBG.png');
        this.load.image('ContinueRetryBtn', 'assets/continueRetryBtn.png');
        this.load.image('PauseRetryBtn', 'assets/pauseRetryBtn1.png');
        
        this.load.spritesheet('cars_sheet', 'assets/cars_sheet.png', {
            frameWidth: gv.CAR.WIDTH,
            frameHeight: gv.CAR.HEIGHT
        });

        this.load.spritesheet('explosionSS', 'assets/explosion.png', {
            frameWidth: gv.CAR.WIDTH,
            frameHeight: gv.CAR.HEIGHT
        });

        this.load.spritesheet('lifebar', 'assets/lifebar.png', {
            frameWidth: 90,
            frameHeight: 44
        });

        this.load.spritesheet('carMov', 'assets/car1_anim_mov1.png', {
            frameWidth: gv.CAR.WIDTH,
            frameHeight: gv.CAR.HEIGHT
        });

        this.menuGameOver = this.add.group();
        this.menuPause = this.add.group();

        GameScene.loadPositionOnScreen();

        this.playerCarsGroup = this.add.group();
        this.enemiesGroup = this.add.group();
        this.startUI = this.add.group();

        scene = this;
    }

    async create() {
        this.state = GAME_STATE.START;
        this.setKeys();
        this.showStartingScreen();
        this.leaderBoard = new LeaderBoard();
        await this.getPlayer();
        map = new Map();
    }

    startGame() {
        this.tutorial.destroy();
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
        this.state = GAME_STATE.RUNNING;
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

        window.addEventListener('keydown', () => {
            if (this.state === GAME_STATE.RUNNING) {
                if (this.moveKeys.left.isDown) {
                    this.changeTrack('left');
                }
                if (this.moveKeys.right.isDown) {
                    this.changeTrack('right');
                }
            }
        }, false);

        if (this.input.pointer1.isDown || this.input.pointer2.isDown) {
            let xPointer1; 
            let xPointer2;

            if (this.state === GAME_STATE.START) {
                this.showTutorial();
            } else if (this.state === GAME_STATE.RUNNING) {
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
                this.inbetweenGap = 20;
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

    async getPlayer() {
        this.playerKey = Utils.getCookie('playerKey') || Utils.generateId();
        Utils.setCookie('playerKey', this.playerKey, 1000);
        const player = await this.leaderBoard.getPlayer(this.playerKey);
        this.highScore = player.highScore;
        console.log(player);
    }

    async postHighScore(isHighScore:boolean) {
        if (isHighScore) {
            await this.leaderBoard.postPlayerInLeaderBoard(this.highScore, this.playerKey);
        }
    }

    showUI() {
        const uiScoringBackgroundHeight = 81;

        this.currentLevelDraw = this.add.text(10, uiScoringBackgroundHeight + 60, `Score:${this.score}`, {
            font: 'bold 33px Geneva'
        }).setDepth(1.2);

        const firstLifeImage1 = this.add.image(33, 50, 'lifebar', 0).setDepth(2).setOrigin(0, 0);
        const secondLifeImage1 = this.add.image(123, 50, 'lifebar', 1).setDepth(2).setOrigin(0, 0);
        this.lifesImageArray.push(firstLifeImage1);
        this.lifesImageArray.push(secondLifeImage1);

        this.add.image(33, 50, 'lifebar', 2).setDepth(1.5).setOrigin(0, 0);
        this.add.image(123, 50, 'lifebar', 3).setDepth(1.5).setOrigin(0, 0);

        this.add.image(0, 30, 'UIScoringScreen').setDepth(1.1).setOrigin(0, 0); //Bigger upper Score Board
        this.add.image(0, uiScoringBackgroundHeight + 40, 'UIScoringScreen').setDepth(1.1).setOrigin(0, 0); //Bigger upper Score Board
        //this.add.image(-50, 30 + uiScoringBackgroundHeight + 10, 'UIScoringScreen').setDepth(1.1).setOrigin(0, 0); //Lower Score Board

        this.add.image(5, 50, 'carIcon').setDepth(2).setOrigin(0, 0);

        const pauseBtn = this.add.image(960, 50, 'PauseButton').setDepth(1).setOrigin(0, 0);
        pauseBtn.setInteractive({ useHandCursor: true });
        pauseBtn.on('pointerup', () => this.pauseMenu());
    }

    pauseMenu() {
        const timeWhenItStopped = this.time.now;
        if (this.state !== GAME_STATE.PAUSE) {
            const imageHeight = 246;
            const yPosition = gv.CANVAS.HEIGHT / 2 - imageHeight / 2;
            const pauseMenu = this.add.image(0, yPosition, 'pauseBG').setDepth(1).setOrigin(0, 0);
            const pauseRetryBtn = this.add.image(200, yPosition + 100, 'PauseRetryBtn').setDepth(1).setOrigin(0, 0);
            const continueRetryBtn = this.add.image(700, yPosition + 100, 'ContinueRetryBtn').setDepth(1).setOrigin(0, 0);
            pauseRetryBtn.setInteractive({ useHandCursor: true });
            pauseRetryBtn.on('pointerup', () => {
                this.menuPause.clear(true, true);
                this.resetGame();
            });
            
            continueRetryBtn.setInteractive({ useHandCursor: true });
            continueRetryBtn.on('pointerup', () => this.continueGame(timeWhenItStopped));
    
            this.menuPause.addMultiple([pauseMenu, pauseRetryBtn, continueRetryBtn]);
            this.state = GAME_STATE.PAUSE;
        } else {
            this.continueGame(timeWhenItStopped);
        }
    }

    continueGame(timeWhenItStopped:number) {
        this.menuPause.clear(true, true);
        this.state = GAME_STATE.RUNNING;
        console.log( spawner.getTimeBetweenSpawn(timeWhenItStopped));
        setTimeout(() => spawner.createEnemy(), spawner.currentGap);
    }

    showStartingScreen() {
        const startingScreenImgWidth = 920;
        const startingScreenX = gv.BACKGROUND.WIDTH / 2 - startingScreenImgWidth / 2;
        const startingScreenY = gv.BACKGROUND.WIDTH / 2 - 200;
        this.startScreenImgInitialY = startingScreenY;
        this.startScreenImg = this.add.image(startingScreenX, startingScreenY, 'StartScreenImg').setDepth(1).setOrigin(0, 0);

        const startGameText = this.add.text(gv.BACKGROUND.WIDTH / 2, (gv.CANVAS.HEIGHT / 2) + 480, 'start game', {
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

    async gameOver() {
        this.state = GAME_STATE.GAME_OVER;
        const backgroundGameOverWidth = 850;
        const backgroundGameOverHeight = 1300;
        const backgroundGamoOverX = (gv.CANVAS.WIDTH / 2) - backgroundGameOverWidth / 2;
        const backgroundGamoOverY = (gv.CANVAS.HEIGHT / 2) - backgroundGameOverHeight / 2;
        let isHighScore = false;

        const gameOverScreen = this.add.image(backgroundGamoOverX, backgroundGamoOverY, 'GameOverScreen').setDepth(1).setOrigin(0, 0);

        const scoretext1 = this.add.text(gv.BACKGROUND.WIDTH / 2 - 210, backgroundGamoOverY + 280, `${this.score}`, {
            font: '60px Geneva',
            align: 'center' // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
        }).setDepth(1.1);

        scoretext1.x -= scoretext1.width / 2;

        if (Number(this.score) > Number(this.highScore)) {
            this.highScore = this.score;
            isHighScore = true;
        }

        const highScoretext1 = this.add.text(gv.BACKGROUND.WIDTH / 2 + 210, backgroundGamoOverY + 280, `${this.highScore}`, {
            font: '60px Geneva',
            align: 'center' // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
        }).setDepth(1.1);

        highScoretext1.x -= highScoretext1.width / 2;

        const buttonWidth = 628;
        const calcX = (backgroundGameOverWidth - buttonWidth) / 2;
        const btnRetry = this.add.image(backgroundGamoOverX + calcX, backgroundGamoOverY + 1040, 'RetryButton').setOrigin(0, 0).setDepth(1.1);
        btnRetry.setInteractive({ useHandCursor: true });
        btnRetry.on('pointerup', () => this.resetGame());

        await this.manageAndDrawLeaderBoard(isHighScore);

        this.menuGameOver.addMultiple([gameOverScreen, highScoretext1, scoretext1, btnRetry]);
    }

    async manageAndDrawLeaderBoard(isHighScore: boolean) {
        if (this.state === GAME_STATE.GAME_OVER) {
            await this.postHighScore(isHighScore);
            const leaderboard = await this.leaderBoard.getTable(this.playerKey);
            this.drawLeaderboard(leaderboard);
            return leaderboard;
        }
        return null;
    }

    drawLeaderboard(leaderBoard) {
        const boardWidth = 512;
        const boardHeight = 70;
        const leaderBoardUserBasePostion = 890;
        const userBoardX = (gv.CANVAS.WIDTH / 2) - boardWidth / 2;
        let contador = 0;

        for (let i = leaderBoard.length - 1; i >= 0; i--) {
            const marginY = contador * 90; 
            contador++;
            const {
                highScore, key, username, pos 
            } = leaderBoard[i];
            const name = username ? Utils.formatUserNameToBoard(username) : Utils.formatUserNameToBoard(key);

            const userBoardY = (leaderBoardUserBasePostion + marginY) - boardHeight / 2;
            const userBoardImgName = leaderBoard[i].me ? 'UserBoardPlayer' : 'UserBoard';
            const userNameXPos = leaderBoard[i].me ? userBoardX + 195 : userBoardX + 140;
            const userBoardScreen = this.add.image(userBoardX, userBoardY, userBoardImgName).setDepth(1).setOrigin(0, 0);
            const currentUsernameElem = this.add.text(userNameXPos, userBoardY + 18, name, {
                font: '30px Geneva'
            }).setDepth(1.1);
            const userBoardHighscore = this.add.text(userBoardX + 425, userBoardY + 20, highScore, {
                font: '25px Geneva',
                align: 'center',
                fixedWidth: 80
            }).setDepth(1.1);
            const userBoardPos = this.add.text(userBoardX + 10, userBoardY + 20, pos, {
                font: '25px Geneva',
                align: 'center',
                fixedWidth: 38
            }).setDepth(1.1);

            const carImg = this.add.image(userBoardX + 81, userBoardY + 18, 'carIcon').setDepth(2).setOrigin(0, 0);
            const color = `0x${Utils.getRandomColor()}`;
            const iconRect = scene.add.rectangle(userBoardX + 62, userBoardY + 8, 62, 55, color).setDepth(1).setOrigin(0, 0);

            if (leaderBoard[i].me) {
                currentUsernameElem.setText(Utils.formatUserNameToBoard(name, 10));
                const btnEdit = this.add.image(userBoardX + 130, userBoardY + 7, 'BtnEdit').setDepth(1).setOrigin(0, 0);
                btnEdit.setInteractive({ useHandCursor: true });
                btnEdit.on('pointerup', () => this.showEditScreen(currentUsernameElem));
                this.menuGameOver.add(btnEdit);
            }

            this.menuGameOver.addMultiple([userBoardScreen, userBoardHighscore, userBoardPos, currentUsernameElem, carImg, iconRect]);
        }
    }

    showEditScreen(currentUsernameElem) {
        $('#userinput-board').show();
        // eslint-disable-next-line @typescript-eslint/no-loop-func
        $(document).on('click', '#button-cancel', () => {
            $('#userinput-board').hide();
        });

        // eslint-disable-next-line @typescript-eslint/no-loop-func
        $(document).on('click', '#button-accept', () => {
            const usernameInput = $('#usernameInput').val() as string;
            currentUsernameElem.setText(Utils.formatUserNameToBoard(usernameInput, 10));
            this.leaderBoard.postPlayerUsername(usernameInput, this.playerKey);
            $('#userinput-board').hide();
        });
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
