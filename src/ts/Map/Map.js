"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../Utils/utils");
var App_1 = require("../App");
var gv = require("../Utils/gameValues");
// eslint-disable-next-line import/prefer-default-export
var Map = /** @class */ (function () {
    function Map() {
        this.currentSpeed = gv.INITIAL_SPEED;
        this.overlayImage = App_1.scene.add.image(utils_1.Utils.halfScreenBackground('x'), 0, 'background_overlay').setOrigin(0, 0);
        this.overlayImage1 = App_1.scene.add.image(utils_1.Utils.halfScreenBackground('x'), -gv.BACKGROUND.HEIGHT, 'background_overlay').setOrigin(0, 0);
    }
    Map.prototype.move = function () {
        this.currentSpeed = gv.INITIAL_SPEED + App_1.scene.getSpeed();
        this.overlayImage.y += this.currentSpeed + 1;
        this.overlayImage1.y += this.currentSpeed + 1;
        if (this.overlayImage.y >= gv.BACKGROUND.HEIGHT) {
            var diff = gv.BACKGROUND.HEIGHT - this.overlayImage.y;
            this.createNewOverlay(diff);
        }
    };
    Map.prototype.setMapSpeed = function (newSpeed) {
        this.currentSpeed = newSpeed;
    };
    Map.prototype.createNewOverlay = function (diff) {
        this.overlayImage.destroy();
        this.overlayImage = this.overlayImage1;
        this.overlayImage1 = App_1.scene.add.image(utils_1.Utils.halfScreenBackground('x'), -gv.BACKGROUND.HEIGHT - diff, 'background_overlay').setOrigin(0, 0);
    };
    return Map;
}());
exports.Map = Map;
