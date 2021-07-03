export const KEY_PRESSED_TIMER = 300;
export const FRAMES_PER_SECOND = 60;

export const CANVAS = {
    WIDTH: null,
    HEIGHT: null
};

export const BACKGROUND = {
    WIDTH: 1080,
    HEIGHT: 1920
};

export const ROAD = {
    WIDTH: 284,
    HEIGHT: 1920,
    GAP_MIDDLE: 50
};

export const CAR = {
    WIDTH: 100,
    HEIGHT: 150,
    Y_POSITION: 1700
};

export const POSITION = {
    LEFT_1: -(ROAD.WIDTH + ROAD.GAP_MIDDLE) - CAR.WIDTH + 50,
    LEFT_2: -(ROAD.GAP_MIDDLE + CAR.WIDTH) - 30,
    RIGHT_1: ROAD.GAP_MIDDLE + 30,
    RIGHT_2: (ROAD.GAP_MIDDLE + ROAD.WIDTH) - CAR.WIDTH + 30
};

export const TIME_PER_LEVEL = 1000;
export const INITIAL_GAP = 1400;
export const INITIAL_SPEED = 4;
export const INITIAL_LIFES = 2;
