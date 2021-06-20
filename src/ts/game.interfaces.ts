export interface Position {
    x: number,
    y: number
}

export enum GAME_STATE {
    RUNNING,
    PAUSE,
    GAME_OVER
}

export enum PLAYER_STATE {
    MOVING,
    IDLE,
    PAUSE,
}

export enum ENEMY_TYPE {
    NORMAL
}

export type side = 'left' | 'right';