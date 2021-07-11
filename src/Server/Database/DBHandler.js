let db;
const admin = require('firebase-admin');
const moment = require('moment');
require('dotenv').config();
const serviceAccount = JSON.parse(process.env.DB_ADMIN_SDK);
const LEADER_BOARD = 'leaderboard';
const MAX_PLAYER_PER_CUSTOM_LIST = 2;

const DBinit = async () => {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });

    db = admin.firestore();
};
module.exports.DBinit = DBinit;

const getLeaderBoard = async (id) => {
    const leaderboard = db.collection(LEADER_BOARD);
    const snapshot = await leaderboard.orderBy('highScore', 'desc').get();
    const players = [];
    let index = 0;
    let maxIndex = null;
    const length = snapshot.size;
    let currentMaxList = null;
    let customLeaderBoard = null;
    snapshot.forEach((doc) => {
        const user = doc.data();
        user.pos = index + 1;
        players.push(user);
        if (user.key === id) {
            currentMaxList = MAX_PLAYER_PER_CUSTOM_LIST + index;
            while (currentMaxList > length || currentMaxList === index) {
                currentMaxList -= 1;
            }
            maxIndex = currentMaxList;

            players[index].me = true;
        }

        if (index === maxIndex) {
            customLeaderBoard = customPlayersTable(players);
        }
        index += 1;
    });
    return customLeaderBoard;
};
module.exports.getLeaderBoard = getLeaderBoard;

const customPlayersTable = (players) => {
    const newArr = [];
    for (let i = players.length - 1; i > (players.length - 1) - 5; i--) {
        if (players[i]) {
            newArr.push(players[i]);
        }
    }
    return newArr;
};

const getPlayerInLeaderBoard = async (id) => {
    const leaderboard = db.collection(LEADER_BOARD).doc(id);
    const doc = await leaderboard.get();
    if (!doc.exists) {
        console.log('Creating new player');
        const newPlayer = await postPlayerAtLeadboard(id, { key: id });
        return newPlayer;
    }

    console.log('Returning existant player');
    return doc.data();
};
module.exports.getPlayerInLeaderBoard = getPlayerInLeaderBoard;

const postPlayerAtLeadboard = async (id, playerData) => {
    const { score, key } = playerData;
    const timestamp = moment().format('YYYY-MM-DD[T]HH:mm:ss:SSS');
    const player = {
        highScore: Number(score) || 0,
        timestamp,
        key
    };
    
    const leaderBoardPlayerRef = db.collection(LEADER_BOARD).doc(id);
    await leaderBoardPlayerRef.set(player);
    return player;
};
module.exports.postPlayerAtLeadboard = postPlayerAtLeadboard;

const postPlayerUsername = async (id, username) => {
    const leaderBoardPlayerRef = db.collection(LEADER_BOARD).doc(id);
    const res = await leaderBoardPlayerRef.update({ username });
    console.log( res)
    return res;
};
module.exports.postPlayerUsername = postPlayerUsername;
