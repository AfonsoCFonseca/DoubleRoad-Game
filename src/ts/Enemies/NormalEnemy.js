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
var Enemy_1 = require("./Enemy");
var gv = require("../Utils/gameValues");
var App_1 = require("../App");
var NormalEnemy = /** @class */ (function (_super) {
    __extends(NormalEnemy, _super);
    function NormalEnemy(config) {
        var _this = this;
        config.imageName = 'normal_car';
        config.currentSpeed = gv.INITIAL_SPEED + App_1.scene.getSpeed();
        _this = _super.call(this, config) || this;
        return _this;
    }
    return NormalEnemy;
}(Enemy_1.Enemy));
exports.NormalEnemy = NormalEnemy;
