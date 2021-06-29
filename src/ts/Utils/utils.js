"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var App_1 = require("../App");
var consts = require("./gameValues");
// eslint-disable-next-line import/prefer-default-export
var Utils = /** @class */ (function () {
    function Utils() {
    }
    Utils.rndNumber = function (min, max) {
        return Math.random() * (max - min) + min;
    };
    Utils.generateId = function () {
        return "_" + Math.random().toString(36).substr(2, 9);
    };
    Utils.getSide = function (x) {
        return x >= 700 ? 'right' : 'left';
    };
    Utils.isMobile = function () {
        if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
            return true;
        }
        return false;
    };
    Utils.setCookie = function (cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
        var expires = "expires=" + d.toUTCString();
        document.cookie = cname + "=" + cvalue + ";" + expires + ";SameSite=None; Secure;path=/";
    };
    Utils.getCookie = function (cname) {
        var name = cname + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) === ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) === 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';
    };
    Utils.halfScreenBackground = function (axis, edge) {
        if (edge === void 0) { edge = null; }
        if (axis === 'x')
            return !edge ? (consts.CANVAS.WIDTH / 2) - (consts.BACKGROUND.WIDTH / 2) : (consts.CANVAS.WIDTH / 2) + (consts.BACKGROUND.WIDTH / 2);
        return !edge ? (consts.CANVAS.HEIGHT / 2) - (consts.BACKGROUND.HEIGHT / 2) : (consts.CANVAS.HEIGHT / 2) + (consts.BACKGROUND.HEIGHT / 2);
    };
    Utils.halfScreen = function (axis, objectSize) {
        if (axis === 'x')
            return (consts.CANVAS.WIDTH / 2) - objectSize;
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
            }
        });
    };
    return Utils;
}());
exports.Utils = Utils;
