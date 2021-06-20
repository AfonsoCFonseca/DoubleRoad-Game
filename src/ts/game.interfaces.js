"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var GAME_STATE;
(function (GAME_STATE) {
    GAME_STATE[GAME_STATE["RUNNING"] = 0] = "RUNNING";
    GAME_STATE[GAME_STATE["PAUSE"] = 1] = "PAUSE";
    GAME_STATE[GAME_STATE["GAME_OVER"] = 2] = "GAME_OVER";
})(GAME_STATE = exports.GAME_STATE || (exports.GAME_STATE = {}));
var PLAYER_STATE;
(function (PLAYER_STATE) {
    PLAYER_STATE[PLAYER_STATE["MOVING"] = 0] = "MOVING";
    PLAYER_STATE[PLAYER_STATE["IDLE"] = 1] = "IDLE";
    PLAYER_STATE[PLAYER_STATE["PAUSE"] = 2] = "PAUSE";
})(PLAYER_STATE = exports.PLAYER_STATE || (exports.PLAYER_STATE = {}));
var ENEMY_TYPE;
(function (ENEMY_TYPE) {
    ENEMY_TYPE[ENEMY_TYPE["NORMAL"] = 0] = "NORMAL";
})(ENEMY_TYPE = exports.ENEMY_TYPE || (exports.ENEMY_TYPE = {}));
