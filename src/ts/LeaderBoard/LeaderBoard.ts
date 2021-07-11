import { LeaderBoardPlayer } from "../game.interfaces";
import { Utils } from "../Utils/utils";

export default class LeaderBoard {
    playersArr: LeaderBoardPlayer[];

    constructor() {

    }

    public async getTable(id:string) {
        return await Utils.requestBE({
            type: 'GET',
            url: `/leaderboardTable/${id}`
        }).then((leaderboard) => leaderboard );
    }

    // eslint-disable-next-line class-methods-use-this
    public async getPlayer(playerKey:string): Promise<LeaderBoardPlayer> {
        const player = await Utils.requestBE({
            type: 'GET',
            url: `/leaderboard/${playerKey}`
        }) as LeaderBoardPlayer;
        return player;
    }

    public async postPlayerInLeaderBoard(highScore: number,playerKey: string) {
        const leaderboard = await Utils.requestBE({
            type: 'POST',
            url: `/leaderboard/${playerKey}`,
            obj: {
                score: Number(highScore),
                key: playerKey
            }
        });
        return leaderboard
    }

    public async postPlayerUsername(username:string, playerKey: string) {
        const player = await Utils.requestBE({
            type: 'GET',
            url: `/leaderboard/username/${playerKey}/${username}`,
        });
        return player
    }
}