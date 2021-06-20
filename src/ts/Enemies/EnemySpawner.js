"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var App_1 = require("../App");
var utils_1 = require("../Utils/utils");
var game_interfaces_1 = require("../game.interfaces");
var NormalEnemy_1 = require("./NormalEnemy");
// eslint-disable-next-line import/prefer-default-export
var EnemySpawner = /** @class */ (function () {
    function EnemySpawner() {
        this.currentEnemies = [];
        this.createEnemy();
    }
    EnemySpawner.prototype.createEnemy = function () {
        var _this = this;
        var rndPos = App_1.scene.leftCar.getBothPos()[Math.floor(utils_1.Utils.rndNumber(0, 2))];
        var currentLeftCar = this.getEnemy(rndPos);
        this.currentEnemies.push(currentLeftCar);
        rndPos = App_1.scene.rightCar.getBothPos()[Math.floor(utils_1.Utils.rndNumber(0, 2))];
        var currentRightCar = this.getEnemy(rndPos);
        this.currentEnemies.push(currentRightCar);
        setTimeout(function () {
            if (App_1.scene.state === game_interfaces_1.GAME_STATE.RUNNING)
                _this.createEnemy();
        }, App_1.scene.getGap());
    };
    EnemySpawner.prototype.getEnemy = function (xPos) {
        console.log(App_1.scene.currentLevel);
        return new NormalEnemy_1.NormalEnemy({ x: xPos, y: -200 });
    };
    EnemySpawner.prototype.clearAllEnemies = function () {
        this.currentEnemies.forEach(function (car) {
            car.destroy();
        });
    };
    EnemySpawner.prototype.deleteEnemy = function (id) {
        var filtered = this.currentEnemies.filter(function (enemy) { return id !== enemy.ID; });
        this.currentEnemies = filtered;
    };
    return EnemySpawner;
}());
exports.EnemySpawner = EnemySpawner;
