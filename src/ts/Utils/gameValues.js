"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KEY_PRESSED_TIMER = 300;
exports.FRAMES_PER_SECOND = 60;
exports.CANVAS = {
    WIDTH: null,
    HEIGHT: null
};
exports.BACKGROUND = {
    WIDTH: 1080,
    HEIGHT: 1920
};
exports.ROAD = {
    WIDTH: 237,
    HEIGHT: 600,
    GAP_MIDDLE: 30
};
exports.CAR = {
    WIDTH: 60,
    HEIGHT: 90,
    Y_POSITION: 500
};
exports.POSITION = {
    LEFT_1: -(exports.ROAD.WIDTH + exports.ROAD.GAP_MIDDLE) + 30,
    LEFT_2: -(exports.ROAD.GAP_MIDDLE + exports.CAR.WIDTH) - 30,
    RIGHT_1: exports.ROAD.GAP_MIDDLE + 30,
    RIGHT_2: exports.ROAD.GAP_MIDDLE + exports.ROAD.WIDTH - exports.CAR.WIDTH - 30
};
exports.TIME_PER_LEVEL = 1000;
exports.INITIAL_GAP = 1300;
exports.INITIAL_SPEED = 2;
exports.INITIAL_LIFES = 2;
