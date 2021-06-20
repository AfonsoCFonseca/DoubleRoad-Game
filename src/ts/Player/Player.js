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
var utils_1 = require("../Utils/utils");
var App_1 = require("../App");
var game_interfaces_1 = require("../game.interfaces");
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(config) {
        var _this = _super.call(this, App_1.scene, config.x, config.y, config.spriteName, 0) || this;
        _this.currentPos = 'pos2';
        _this.movementCooldownRdy = true;
        _this.state = game_interfaces_1.PLAYER_STATE.IDLE;
        App_1.scene.physics.add.existing(_this);
        App_1.scene.physics.world.enable(_this);
        App_1.scene.add.existing(_this).setDepth(1).setOrigin(0, 0);
        App_1.scene.physics.world.enable(_this);
        App_1.scene.add.existing(_this);
        App_1.scene.playerCarsGroup.add(_this);
        _this.side = utils_1.Utils.getSide(_this.x);
        _this.nextX = _this.x + 5;
        App_1.scene.anims.create({
            key: 'carIdleAnimation',
            frames: App_1.scene.anims.generateFrameNumbers('carMov', { end: 4 }),
            frameRate: 8,
            repeat: -1
        });
        App_1.scene.anims.create({
            key: 'carLeftAnimation',
            frames: App_1.scene.anims.generateFrameNumbers('carMov', { start: 5, end: 10 }),
            duration: 150,
            repeat: 0
        });
        App_1.scene.anims.create({
            key: 'carRightAnimation',
            frames: App_1.scene.anims.generateFrameNumbers('carMov', { start: 10, end: 16 }),
            duration: 150,
            repeat: 0,
        });
        _this.play('carIdleAnimation');
        return _this;
    }
    Player.prototype.move = function (pos1, pos2) {
        var _this = this;
        this.state = game_interfaces_1.PLAYER_STATE.MOVING;
        var x = this.currentPos == 'pos1' ? pos2 : pos1;
        var animationMovement = this.currentPos == 'pos1' ? 'carLeftAnimation' : 'carRightAnimation';
        this.play(animationMovement);
        this.once('animationcomplete', function () {
            _this.play("carIdleAnimation");
        });
        utils_1.Utils.makeAnimation(this, { x: x, y: this.y }, 150, function () {
            _this.currentPos = _this.currentPos == 'pos1' ? 'pos2' : 'pos1';
            _this.state = game_interfaces_1.PLAYER_STATE.IDLE;
            _this.nextX = _this.x;
        });
    };
    Player.prototype.setToInitialPosition = function (initialPos) {
        this.x = initialPos;
        this.nextX = this.x;
        this.currentPos = 'pos2';
    };
    return Player;
}(Phaser.GameObjects.Sprite));
exports.Player = Player;
