"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var App_1 = require("../App");
var consts = require("./gameValues");
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.rndNumber = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    Utils.generateId = function () {
        return '_' + Math.random().toString(36).substr(2, 9);
    };
    Utils.getSide = function (x) {
        return x >= 700 ? 'right' : 'left';
    };
    Utils.isMobile = function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        }
        else {
            return false;
        }
    };
    Utils.halfScreenBackground = function (axis, edge) {
        if (edge === void 0) { edge = null; }
        if (axis == 'x')
            return !edge ? (consts.CANVAS.WIDTH / 2) - (consts.BACKGROUND.WIDTH / 2) : (consts.CANVAS.WIDTH / 2) + (consts.BACKGROUND.WIDTH / 2);
        else
            return !edge ? (consts.CANVAS.HEIGHT / 2) - (consts.BACKGROUND.HEIGHT / 2) : (consts.CANVAS.HEIGHT / 2) + (consts.BACKGROUND.HEIGHT / 2);
    };
    Utils.halfScreen = function (axis, objectSize) {
        if (axis == 'x')
            return (consts.CANVAS.WIDTH / 2) - objectSize;
        else
            return (consts.CANVAS.HEIGHT / 2) - (objectSize / 2);
    };
    Utils.makeAnimation = function (target, _a, duration, callback) {
        var x = _a.x, y = _a.y;
        return App_1.scene.tweens.add({
            targets: target,
            x: x,
            y: y,
            ease: 'Linear',
            duration: duration,
            repeat: 0,
            onComplete: function () {
                callback();
            },
        });
    };
    return Utils;
}());
exports.Utils = Utils;
