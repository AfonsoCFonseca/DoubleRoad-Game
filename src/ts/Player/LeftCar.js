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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var Player_1 = require("./Player");
var gv = require("../Utils/gameValues");
var LeftCar = /** @class */ (function (_super) {
    __extends(LeftCar, _super);
    function LeftCar(config) {
        var _this = _super.call(this, config) || this;
        _this.pos1 = (gv.CANVAS.WIDTH / 2) + gv.POSITION.LEFT_1;
        _this.pos2 = (gv.CANVAS.WIDTH / 2) + gv.POSITION.LEFT_2;
        var pos = {
            x: _this.pos2,
            y: gv.CAR.Y_POSITION
        };
        config = __assign(__assign({}, config), pos);
        _this = _super.call(this, config) || this;
        return _this;
    }
    LeftCar.prototype.move = function () {
        _super.prototype.move.call(this, this.pos1, this.pos2);
    };
    LeftCar.prototype.setToInitialPosition = function () {
        _super.prototype.setToInitialPosition.call(this, this.pos2);
    };
    LeftCar.prototype.getBothPos = function () {
        return [this.pos1, this.pos2];
    };
    return LeftCar;
}(Player_1.Player));
exports.LeftCar = LeftCar;
