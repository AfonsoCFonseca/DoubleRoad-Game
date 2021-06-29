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
// eslint-disable-next-line @typescript-eslint/max-len
// eslint-disable-next-line max-classes-per-file
var App_1 = require("../App");
var gv = require("../Utils/gameValues");
var utils_1 = require("../Utils/utils");
// eslint-disable-next-line import/prefer-default-export
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(config) {
        var _this = _super.call(this, App_1.scene, config.x, config.y, config.imageName, config.carFrame) || this;
        _this.currentSpeed = gv.INITIAL_SPEED + 1;
        App_1.scene.physics.add.existing(_this);
        App_1.scene.physics.world.enable(_this);
        App_1.scene.add.existing(_this).setDepth(1).setOrigin(0, 0);
        App_1.scene.physics.world.enable(_this);
        App_1.scene.add.existing(_this);
        _this.ID = utils_1.Utils.generateId();
        _this.currentSpeed = config.currentSpeed;
        App_1.scene.enemiesGroup.add(_this);
        return _this;
    }
    Enemy.prototype.update = function () {
        this.y += this.currentSpeed;
        if (this.y >= gv.CANVAS.HEIGHT) {
            this.delete();
        }
    };
    Enemy.prototype.delete = function () {
        new Explosion({ x: this.x, y: this.y });
        App_1.spawner.deleteEnemy(this.ID);
        this.destroy();
    };
    return Enemy;
}(Phaser.GameObjects.Sprite));
exports.Enemy = Enemy;
var Explosion = /** @class */ (function (_super) {
    __extends(Explosion, _super);
    function Explosion(config) {
        var _this = _super.call(this, App_1.scene, config.x, config.y + 25, 'explosionSS') || this;
        App_1.scene.anims.create({
            key: 'explosion',
            frames: _this.anims.generateFrameNumbers('explosionSS', { start: 0, end: 5 }),
            duration: 800,
            repeat: false
        });
        _this.once('animationcomplete', function () { return _this.destroy(); });
        App_1.scene.physics.add.existing(_this);
        App_1.scene.physics.world.enable(_this);
        App_1.scene.add.existing(_this).setDepth(1).setOrigin(0, 0);
        App_1.scene.physics.world.enable(_this);
        App_1.scene.add.existing(_this);
        _this.play('explosion');
        return _this;
    }
    return Explosion;
}(Phaser.GameObjects.Sprite));
exports.Explosion = Explosion;
