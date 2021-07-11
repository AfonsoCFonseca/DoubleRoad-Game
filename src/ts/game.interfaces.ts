export interface Position {
    x: number,
    y: number
}

export interface LeaderBoardPlayer{
    name?: string,
    position?: number,
    key: string,
    highScore: number,
    timestamp: string;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum GAME_STATE {
    RUNNING,
    PAUSE,
    GAME_OVER,
    START,
    TUTORIAL
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export enum PLAYER_STATE {
    MOVING,
    IDLE,
    PAUSE
}

export type SIDE = 'left' | 'right';