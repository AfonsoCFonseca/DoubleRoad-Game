"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utils_1 = require("../Utils/utils");
var App_1 = require("../App");
var gv = require("../Utils/gameValues");
var Map = /** @class */ (function () {
    function Map() {
        this.currentSpeed = gv.INITIAL_SPEED;
        App_1.scene.add.image(utils_1.Utils.halfScreenBackground('x'), utils_1.Utils.halfScreenBackground('y'), 'background').setOrigin(0, 0);
        this.overlayImage = App_1.scene.add.image(utils_1.Utils.halfScreenBackground('x'), 0, 'background_overlay').setOrigin(0, 0);
        this.overlayImage1 = App_1.scene.add.image(utils_1.Utils.halfScreenBackground('x'), -gv.BACKGROUND.HEIGHT, 'background_overlay').setOrigin(0, 0);
    }
    Map.prototype.move = function () {
        this.overlayImage.y = this.overlayImage.y + this.currentSpeed;
        this.overlayImage1.y = this.overlayImage1.y + this.currentSpeed;
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
        if (App_1.scene.currentLevel <= 70)
            this.currentSpeed += 0.2;
    };
    return Map;
}());
exports.Map = Map;
