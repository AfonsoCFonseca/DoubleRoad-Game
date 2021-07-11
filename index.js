const express = require('express');
const path = require('path');
const app = express();

const { DBinit } = require('./src/Server/Database/DBHandler');

const requests = require('./router_requests');
const port = process.env.PORT || 8080;
let db;
module.exports.db = db;

const auth = (req, res, next) => {
    return next();
};

app.use('/dist', express.static(path.join(__dirname, '/dist')));
app.use('/assets', express.static(path.join(__dirname, '/assets')));
app.use('/views', express.static(path.join(__dirname, '/views')));

app.use('/', auth, requests);

app.get('/', (req, res) => {
    res.sendFile(`${__dirname}/views/homepage.html`);
});

app.listen(port, async () => {
    await DBinit();

    console.log(__dirname);
    console.log('Simple Server Running on port 8080');
});
