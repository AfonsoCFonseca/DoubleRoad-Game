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
var Enemy_1 = require("./Enemy");
var gv = require("../Utils/gameValues");
var App_1 = require("../App");
var utils_1 = require("../Utils/utils");
var NormalEnemy = /** @class */ (function (_super) {
    __extends(NormalEnemy, _super);
    function NormalEnemy(config) {
        var _this = this;
        var normalCarConfig = __assign(__assign({}, config), { imageName: 'cars_sheet', carFrame: Math.floor(utils_1.Utils.rndNumber(1, 5)), currentSpeed: gv.INITIAL_SPEED + App_1.scene.getSpeed() });
        _this = _super.call(this, normalCarConfig) || this;
        return _this;
    }
    return NormalEnemy;
}(Enemy_1.Enemy));
exports.default = NormalEnemy;
