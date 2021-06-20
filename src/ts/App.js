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
var GameScene = /** @class */ (function (_super) {
    __extends(GameScene, _super);
    function GameScene() {
        var _this = _super.call(this, {}) || this;
        _this.currentLevel = 1;
        _this.inbetweenSpeed = 0.2;
        _this.inbetweenGap = 30;
        _this.score = 0;
        _this.highScore = 0;
        _this.lifesImageArray = [];
        _this.carCrash = _this.carCrash.bind(_this);
        return _this;
    }
    GameScene.prototype.preload = function () {
        this.load.image('background', 'assets/background1.jpg');
        this.load.image('background_overlay', 'assets/background_overlay1.png');
        this.load.image('normal_car', 'assets/normal_car_1.png');
        this.load.image('switcher_car', 'assets/normal_car_2.png');
        this.load.image('GameOverScreen', 'assets/gameOverScreen.png');
        this.load.image('RetryButton', 'assets/RetryButton.png');
        this.load.spritesheet('lifes', 'assets/lifes.png', {
            frameWidth: gv.CAR.WIDTH / 2,
            frameHeight: gv.CAR.HEIGHT / 2
        });
        this.load.spritesheet('carMov', 'assets/car1_anim_mov.png', {
            frameWidth: gv.CAR.WIDTH,
            frameHeight: gv.CAR.HEIGHT
        });
        this.menuGameOver = this.add.group();
        this.loadPositionOnScreen();
        this.playerCarsGroup = this.add.group();
        this.enemiesGroup = this.add.group();
        exports.scene = this;
    };
    GameScene.prototype.create = function () {
        this.state = game_interfaces_1.GAME_STATE.RUNNING;
        this.currentSpeed = gv.INITIAL_SPEED;
        this.currentGap = gv.INITIAL_GAP;
        this.lifes = gv.INITIAL_LIFES;
        exports.map = new Map_1.Map();
        this.createPlayer();
        exports.spawner = new EnemySpawner_1.EnemySpawner();
        this.setKeys();
        this.levelUpTimer();
        this.showUI();
        this.physics.add.collider(this.enemiesGroup, this.playerCarsGroup, this.carCrash);
        this.input.addPointer(3);
        exports.scene.scale.lockOrientation('landscape');
    };
    GameScene.prototype.update = function () {
        this.events.emit('updateEnemy');
        this.keys();
        exports.map.move();
    };
    GameScene.prototype.createPlayer = function () {
        var car = {
            spriteName: 'carIdleAnimation'
        };
        this.rightCar = new RightCar_1.RightCar(car);
        car = {
            spriteName: 'carIdleAnimation'
        };
        this.leftCar = new LeftCar_1.LeftCar(car);
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
        if (this.state === game_interfaces_1.GAME_STATE.RUNNING) {
            setTimeout(function () {
                _this.levelUp();
                _this.levelUpTimer();
            }, gv.TIME_PER_LEVEL);
        }
    };
    GameScene.prototype.carCrash = function (enemy) {
        enemy.destroy();
        this.lifes -= 1;
        if (this.lifes >= 0) {
            this.lifesImageArray[this.lifes].setTexture('lifes', 1);
        }
        else {
            this.gameOver();
        }
    };
    GameScene.prototype.levelUp = function () {
        this.currentLevel += 1;
        this.currentLevelDraw.setText("level " + this.currentLevel);
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
    GameScene.prototype.resetGame = function () {
        var _this = this;
        this.currentLevel = 1;
        this.lifes = gv.INITIAL_LIFES;
        this.currentSpeed = gv.INITIAL_SPEED;
        this.currentGap = gv.INITIAL_GAP;
        this.lifesImageArray.forEach(function (lifeImg, index) { return _this.lifesImageArray[index].setTexture('lifes', 0); });
        this.leftCar.setToInitialPosition();
        this.rightCar.setToInitialPosition();
        exports.map.setMapSpeed(gv.INITIAL_SPEED);
        exports.spawner.clearAllEnemies();
        this.resetScore();
        this.menuGameOver.clear(true, true);
        this.state = game_interfaces_1.GAME_STATE.RUNNING;
        exports.spawner.createEnemy();
    };
    GameScene.prototype.resetScore = function () {
        if (this.score > this.highScore) {
            this.highScore = this.score;
        }
        this.score = 0;
    };
    GameScene.prototype.showUI = function () {
        this.currentLevelDraw = this.add.text(20, 15, "level " + this.currentLevel, {
            fontSize: '30px'
        }).setDepth(1.1);
        var firstLifeImage = this.add.image(20, 50, 'lifes', 0).setDepth(1).setOrigin(0, 0);
        var secondLifeImage = this.add.image(60, 50, 'lifes', 0).setDepth(1).setOrigin(0, 0);
        this.lifesImageArray.push(firstLifeImage);
        this.lifesImageArray.push(secondLifeImage);
    };
    GameScene.prototype.gameOver = function () {
        var _this = this;
        this.state = game_interfaces_1.GAME_STATE.GAME_OVER;
        var backgroundGameOverWidth = 300;
        var backgroundGameOverHeight = 400;
        var backgroundGamoOverX = (exports.game.canvas.width / 2) - backgroundGameOverWidth / 2;
        var backgroundGamoOverY = (exports.game.canvas.height / 2) - backgroundGameOverHeight / 2;
        var gameOverScreen = this.add.image(backgroundGamoOverX, backgroundGamoOverY, 'GameOverScreen').setDepth(1).setOrigin(0, 0);
        var scoretext1 = this.add.text(backgroundGamoOverX + 170, backgroundGamoOverY + 135, '10', {
            fontSize: '30px',
        }).setDepth(1.1);
        var highScoretext1 = this.add.text(backgroundGamoOverX + 170, backgroundGamoOverY + 190, '200', {
            fontSize: '30px',
        }).setDepth(1.1);
        var buttonWidth = 225;
        var calcX = (backgroundGameOverWidth - buttonWidth) / 2;
        var btnRetry = this.add.image(backgroundGamoOverX + calcX, backgroundGamoOverY + 270, 'RetryButton').setOrigin(0, 0).setDepth(1.1);
        btnRetry.setInteractive({ useHandCursor: true });
        btnRetry.setInteractive({ useHandCursor: true });
        btnRetry.on('pointerup', function () { return _this.resetGame(); });
        this.menuGameOver.addMultiple([gameOverScreen, highScoretext1, scoretext1, btnRetry]);
    };
    GameScene.prototype.loadPositionOnScreen = function () {
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
exports.game = new Phaser.Game(exports.config);
