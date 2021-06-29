"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// eslint-disable-next-line @typescript-eslint/naming-convention
var GAME_STATE;
(function (GAME_STATE) {
    GAME_STATE[GAME_STATE["RUNNING"] = 0] = "RUNNING";
    GAME_STATE[GAME_STATE["PAUSE"] = 1] = "PAUSE";
    GAME_STATE[GAME_STATE["GAME_OVER"] = 2] = "GAME_OVER";
    GAME_STATE[GAME_STATE["START"] = 3] = "START";
    GAME_STATE[GAME_STATE["TUTORIAL"] = 4] = "TUTORIAL";
})(GAME_STATE = exports.GAME_STATE || (exports.GAME_STATE = {}));
// eslint-disable-next-line @typescript-eslint/naming-convention
var PLAYER_STATE;
(function (PLAYER_STATE) {
    PLAYER_STATE[PLAYER_STATE["MOVING"] = 0] = "MOVING";
    PLAYER_STATE[PLAYER_STATE["IDLE"] = 1] = "IDLE";
    PLAYER_STATE[PLAYER_STATE["PAUSE"] = 2] = "PAUSE";
})(PLAYER_STATE = exports.PLAYER_STATE || (exports.PLAYER_STATE = {}));
