const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser');
const { 
    getLeaderBoard, getPlayerInLeaderBoard, postPlayerAtLeadboard, postPlayerUsername
} = require('./src/Server/Database/DBHandler');

const jsonParser = bodyParser.json();
router.use(bodyParser.urlencoded({
    extended: true
}));

router.get('/leaderboardTable/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await getLeaderBoard(id);
        res.json({ obj, status: 200 });
    } catch (e) {
        console.log(e);
        res.json(null);
    }
});

router.get('/leaderboard/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const obj = await getPlayerInLeaderBoard(id);
        res.json({ obj, status: 200 });
    } catch (e) {
        console.log(e);
        res.json(null);
    }
});

router.post('/leaderboard/:id', jsonParser, async (req, res) => {
    const { id } = req.params;
    const obj = await postPlayerAtLeadboard(id, req.body);

    res.json({ status: 200, obj });
});

router.get('/leaderboard/username/:id/:username', async (req, res) => {
    try {
        const { id, username } = req.params;
        const obj = await postPlayerUsername(id, username);
        res.json({ obj, status: 200 });
    } catch (e) {
        console.log(e);
        res.json(null);
    }
});

module.exports = router;
