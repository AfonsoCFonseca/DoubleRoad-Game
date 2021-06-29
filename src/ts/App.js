"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
require("phaser");
var Map_1 = require("./Map/Map");
var gv = require("./Utils/gameValues");
var RightCar_1 = require("./Player/RightCar");
var LeftCar_1 = require("./Player/LeftCar");
var EnemySpawner_1 = require("./Enemies/EnemySpawner");
var game_interfaces_1 = require("./game.interfaces");
var utils_1 = require("./Utils/utils");
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this, {}) || this;
        _this.startScreenImgGoingUp = false;
        _this.startScreenImgFinallY = -8;
        _this.currentLevel = 1;
        _this.inbetweenSpeed = 0.2;
        _this.inbetweenGap = 30;
        _this.score = 0;
        _this.highScore = parseInt(utils_1.Utils.getCookie('highscore'), 10) || 0;
        _this.lifesImageArray = [];
        _this.carCrash = _this.carCrash.bind(_this);
        return _this;
    }
    GameScene.prototype.preload = function () {
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
        this.load.spritesheet('carMov', 'assets/car1_anim_mov.png', {
            frameWidth: gv.CAR.WIDTH,
            frameHeight: gv.CAR.HEIGHT
        });
        this.menuGameOver = this.add.group();
        GameScene.loadPositionOnScreen();
        this.playerCarsGroup = this.add.group();
        this.enemiesGroup = this.add.group();
        this.startUI = this.add.group();
        exports.scene = this;
    };
    GameScene.prototype.create = function () {
        this.state = game_interfaces_1.GAME_STATE.START;
        this.setKeys();
        this.showStartingScreen();
        exports.map = new Map_1.Map();
    };
    GameScene.prototype.startGame = function () {
        this.tutorial.destroy();
        this.state = game_interfaces_1.GAME_STATE.RUNNING;
        this.currentSpeed = gv.INITIAL_SPEED;
        this.currentGap = gv.INITIAL_GAP;
        this.lifes = gv.INITIAL_LIFES;
        this.createPlayer();
        exports.spawner = new EnemySpawner_1.EnemySpawner();
        this.levelUpTimer();
        this.score = GameScene.makeScoreMath(this.currentLevel);
        this.showUI();
        this.physics.add.collider(this.enemiesGroup, this.playerCarsGroup, this.carCrash);
        this.input.addPointer(3);
    };
    GameScene.prototype.update = function () {
        if (this.state === game_interfaces_1.GAME_STATE.RUNNING) {
            exports.spawner.currentEnemies.forEach(function (enemy) { return enemy.update(); });
            exports.map.move();
        }
        this.keys();
    };
    GameScene.prototype.createPlayer = function () {
        var car = {
            spriteName: 'carIdleAnimation'
        };
        this.rightCar = new RightCar_1.default(car);
        car = {
            spriteName: 'carIdleAnimation'
        };
        this.leftCar = new LeftCar_1.default(car);
    };
    GameScene.prototype.setKeys = function () {
        this.input.keyboard.createCursorKeys();
        this.moveKeys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.Q,
            right: Phaser.Input.Keyboard.KeyCodes.E
        });
    };
    GameScene.prototype.keys = function () {
        var _this = this;
        window.addEventListener('keyup', function () {
            if (_this.state === game_interfaces_1.GAME_STATE.START) {
                _this.showTutorial();
            }
        }, false);
        exports.scene.input.on('pointerup', function () {
            if (_this.state === game_interfaces_1.GAME_STATE.START) {
                _this.showTutorial();
            }
        });
        window.addEventListener('keydown', function () {
            if (_this.moveKeys.left.isDown) {
                _this.changeTrack('left');
            }
            if (_this.moveKeys.right.isDown) {
                _this.changeTrack('right');
            }
        }, false);
        if (this.input.pointer1.isDown || this.input.pointer2.isDown) {
            var xPointer1 = void 0;
            var xPointer2 = void 0;
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
    };
    GameScene.prototype.changeTrack = function (side) {
        var currentCar = side === 'left' ? this.leftCar : this.rightCar;
        if (currentCar.movementCooldownRdy) {
            this.time.delayedCall(gv.KEY_PRESSED_TIMER, function () {
                currentCar.movementCooldownRdy = true;
            }, [], this);
            currentCar.move();
            currentCar.movementCooldownRdy = false;
        }
    };
    GameScene.prototype.getSpeed = function () {
        return this.currentSpeed;
    };
    GameScene.prototype.getGap = function () {
        return this.currentGap;
    };
    GameScene.prototype.levelUpTimer = function () {
        var _this = this;
        setTimeout(function () {
            if (_this.state === game_interfaces_1.GAME_STATE.RUNNING) {
                _this.levelUp();
                _this.levelUpTimer();
            }
        }, gv.TIME_PER_LEVEL);
    };
    GameScene.prototype.carCrash = function (enemy) {
        enemy.delete();
        this.lifes -= 1;
        if (this.lifes >= 0) {
            this.lifesImageArray[this.lifes].visible = false;
        }
        else {
            this.gameOver();
        }
    };
    GameScene.prototype.levelUp = function () {
        this.currentLevel += 1;
        this.score = GameScene.makeScoreMath(this.currentLevel);
        this.currentLevelDraw.setText("Score:" + this.score);
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
    };
    GameScene.makeScoreMath = function (level) {
        return level * 100;
    };
    GameScene.prototype.resetGame = function () {
        var _this = this;
        this.currentLevel = 1;
        this.lifes = gv.INITIAL_LIFES;
        this.currentSpeed = gv.INITIAL_SPEED;
        this.currentGap = gv.INITIAL_GAP;
        this.lifesImageArray.forEach(function (lifeImg, index) { return _this.lifesImageArray[index].visible = true; });
        this.leftCar.setToInitialPosition();
        this.rightCar.setToInitialPosition();
        exports.map.setMapSpeed(gv.INITIAL_SPEED);
        exports.spawner.clearAllEnemies();
        this.score = 0;
        this.menuGameOver.clear(true, true);
        this.state = game_interfaces_1.GAME_STATE.RUNNING;
        exports.spawner.createEnemy();
        this.levelUpTimer();
        this.currentLevelDraw.setText("Score:" + this.score);
    };
    GameScene.prototype.checkHighScore = function () {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            utils_1.Utils.setCookie('highscore', this.highScore.toString(), 1);
        }
    };
    GameScene.prototype.showUI = function () {
        this.currentLevelDraw = this.add.text(5, 45, "Score:" + this.score, {
            fontSize: '16px'
        }).setDepth(1.1);
        var firstLifeImage1 = this.add.image(23, 10, 'lifebar', 0).setDepth(2).setOrigin(0, 0);
        var secondLifeImage1 = this.add.image(68, 10, 'lifebar', 1).setDepth(2).setOrigin(0, 0);
        this.lifesImageArray.push(firstLifeImage1);
        this.lifesImageArray.push(secondLifeImage1);
        this.add.image(23, 10, 'lifebar', 2).setDepth(1.5).setOrigin(0, 0);
        this.add.image(68, 10, 'lifebar', 3).setDepth(1.5).setOrigin(0, 0);
        this.add.image(0, 0, 'UIScoringScreen').setDepth(1).setOrigin(0, 0);
        this.add.image(5, 8, 'carIcon').setDepth(1).setOrigin(0, 0);
        this.add.image(725, 25, 'PauseButton').setDepth(1).setOrigin(0, 0);
    };
    GameScene.prototype.showStartingScreen = function () {
        var startingScreenImgWidth = 500;
        var startingScreenImgHeight = 400;
        var startingScreenX = gv.BACKGROUND.WIDTH / 2 - startingScreenImgWidth / 2;
        var startingScreenY = gv.BACKGROUND.WIDTH / 2 - (startingScreenImgHeight - 100);
        this.startScreenImgInitialY = startingScreenY;
        this.startScreenImg = this.add.image(startingScreenX, startingScreenY, 'StartScreenImg').setDepth(1).setOrigin(0, 0);
        var startGameText = this.add.text(gv.BACKGROUND.WIDTH / 2, (gv.CANVAS.HEIGHT / 2) + 80, 'start game', {
            font: '30px Geneva',
            align: 'center' // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
        }).setDepth(1.1);
        startGameText.x -= startGameText.width / 2;
        this.startUI.add(startGameText);
        this.startUI.add(this.startScreenImg);
        this.movementTitleScreen();
    };
    GameScene.prototype.showTutorial = function () {
        var _this = this;
        this.state = game_interfaces_1.GAME_STATE.TUTORIAL;
        this.startUI.clear(true, true);
        var imageHeight = 246;
        var yPosition = gv.CANVAS.HEIGHT / 2 - imageHeight / 2;
        this.tutorial = this.add.image(0, yPosition, 'Tutorial').setDepth(1).setOrigin(0, 0);
        setTimeout(function () {
            _this.startGame();
        }, 2000);
    };
    GameScene.prototype.movementTitleScreen = function () {
        var _this = this;
        utils_1.Utils.makeAnimation(this.startScreenImg, { x: this.startScreenImg.x, y: this.startScreenImgInitialY + this.startScreenImgFinallY }, 1000, function () {
            _this.startScreenImgFinallY = _this.startScreenImgGoingUp ? -8 : 8;
            _this.startScreenImgGoingUp = !_this.startScreenImgGoingUp;
            _this.movementTitleScreen();
        });
    };
    GameScene.prototype.gameOver = function () {
        var _this = this;
        this.state = game_interfaces_1.GAME_STATE.GAME_OVER;
        var backgroundGameOverWidth = 300;
        var backgroundGameOverHeight = 400;
        var backgroundGamoOverX = (gv.CANVAS.WIDTH / 2) - backgroundGameOverWidth / 2;
        var backgroundGamoOverY = (gv.CANVAS.HEIGHT / 2) - backgroundGameOverHeight / 2;
        this.checkHighScore();
        var gameOverScreen = this.add.image(backgroundGamoOverX, backgroundGamoOverY, 'GameOverScreen').setDepth(1).setOrigin(0, 0);
        var scoretext1 = this.add.text(gv.BACKGROUND.WIDTH / 2, backgroundGamoOverY + 115, "" + this.score, {
            font: '40px Geneva',
            align: 'center' // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
        }).setDepth(1.1);
        scoretext1.x -= scoretext1.width / 2;
        var highScoretext1 = this.add.text(gv.BACKGROUND.WIDTH / 2, backgroundGamoOverY + 200, "" + this.highScore, {
            font: '35px Geneva',
            align: 'center' // the alignment of the text is independent of the bounds, try changing to 'center' or 'right'
        }).setDepth(1.1);
        highScoretext1.x -= highScoretext1.width / 2;
        var buttonWidth = 206;
        var calcX = (backgroundGameOverWidth - buttonWidth) / 2;
        var btnRetry = this.add.image(backgroundGamoOverX + calcX, backgroundGamoOverY + 270, 'RetryButton').setOrigin(0, 0).setDepth(1.1);
        btnRetry.setInteractive({ useHandCursor: true });
        btnRetry.setInteractive({ useHandCursor: true });
        btnRetry.on('pointerup', function () { return _this.resetGame(); });
        this.menuGameOver.addMultiple([gameOverScreen, highScoretext1, scoretext1, btnRetry]);
    };
    GameScene.loadPositionOnScreen = function () {
        gv.CANVAS.WIDTH = exports.game.canvas.width;
        gv.CANVAS.HEIGHT = exports.game.canvas.height;
    };
    return GameScene;
}(Phaser.Scene));
exports.GameScene = GameScene;
exports.config = {
    type: Phaser.AUTO,
    scale: {
        mode: Phaser.Scale.FIT,
        parent: 'phaser-example',
        autoCenter: Phaser.Scale.CENTER_BOTH,
        orientation: Phaser.Scale.Orientation.PORTRAIT,
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
exports.game = new Phaser.Game(exports.config);
