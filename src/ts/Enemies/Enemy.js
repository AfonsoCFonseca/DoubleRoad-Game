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
var App_1 = require("../App");
var gv = require("../Utils/gameValues");
var utils_1 = require("../Utils/utils");
// eslint-disable-next-line import/prefer-default-export
var Enemy = /** @class */ (function (_super) {
    __extends(Enemy, _super);
    function Enemy(config) {
        var _this = _super.call(this, App_1.scene, config.x, config.y, config.imageName) || this;
        _this.currentSpeed = gv.INITIAL_SPEED + 1;
        App_1.scene.physics.add.existing(_this);
        App_1.scene.physics.world.enable(_this);
        App_1.scene.add.existing(_this).setDepth(1).setOrigin(0, 0);
        App_1.scene.physics.world.enable(_this);
        App_1.scene.add.existing(_this);
        _this.update = _this.update.bind(_this);
        _this.ID = utils_1.Utils.generateId();
        _this.currentSpeed = config.currentSpeed;
        _this.velocity = _this.currentSpeed * gv.FRAMES_PER_SECOND;
        App_1.scene.enemiesGroup.add(_this);
        App_1.scene.events.on('updateEnemy', _this.update);
        return _this;
    }
    Enemy.prototype.update = function () {
        this.y += this.currentSpeed;
        if (this.y >= gv.CANVAS.HEIGHT) {
            this.delete();
        }
    };
    Enemy.prototype.setCurrentSpeed = function (newSpeed) {
        this.currentSpeed = gv.INITIAL_SPEED + newSpeed;
    };
    Enemy.prototype.delete = function () {
        App_1.spawner.deleteEnemy(this.ID);
        App_1.scene.events.off('updateEnemy', this.update);
        this.destroy();
    };
    return Enemy;
}(Phaser.GameObjects.Sprite));
exports.Enemy = Enemy;
