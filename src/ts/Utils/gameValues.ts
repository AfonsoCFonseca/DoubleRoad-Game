export const KEY_PRESSED_TIMER = 300;
export const FRAMES_PER_SECOND = 60;

export const CANVAS = {
    WIDTH: null,
    HEIGHT: null
};

export const BACKGROUND = {
    WIDTH: 800,
    HEIGHT: 600
};

export const ROAD = {
    WIDTH: 237,
    HEIGHT: 600,
    GAP_MIDDLE: 30
};

export const CAR = {
    WIDTH: 60,
    HEIGHT: 90,
    Y_POSITION: 500
};

export const POSITION = {
    LEFT_1: -(ROAD.WIDTH + ROAD.GAP_MIDDLE) + 30,
    LEFT_2: -(ROAD.GAP_MIDDLE + CAR.WIDTH) - 30,
    RIGHT_1: ROAD.GAP_MIDDLE + 30,
    RIGHT_2: ROAD.GAP_MIDDLE + ROAD.WIDTH - CAR.WIDTH - 30
};

export const TIME_PER_LEVEL = 1000;
export const INITIAL_GAP = 1300;
export const INITIAL_SPEED = 2;
export const INITIAL_LIFES = 2;
