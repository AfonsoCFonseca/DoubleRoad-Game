export interface Position {
    x: number,
    y: number
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum GAME_STATE {
    RUNNING,
    PAUSE,
    GAME_OVER,
    START
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum PLAYER_STATE {
    MOVING,
    IDLE,
    PAUSE
}

export type SIDE = 'left' | 'right';