import express from 'express';
import ejs from 'ejs';
import open from 'open';
import CredentialBuilder from './static/CredentialBuilder.js';
import { BOT_USERNAME, CHANNEL_NAME, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_REDIRECT_URI, TWITCH_SCOPE} from "./credentials.js";
import BotService from './static/BotService.js';
import WebScraperService from './static/WebScraperService.js';

const app = express();
app.engine('html', ejs.renderFile);
const port = 3000;
const creds = new CredentialBuilder(TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, 
    TWITCH_REDIRECT_URI, TWITCH_SCOPE, CHANNEL_NAME, BOT_USERNAME);

app.get('/', (req, res) => {
    res.redirect(creds.buildTwitchAuthorizationURL());
});

app.get('/redirect', (req, res) => {
    const authCode = req.query.code;
    creds.setAuthCode(authCode);
    const bot = new BotService(creds);
    bot.process();
    res.render("./bot.html");
});

app.get('/test', (req, res) => {
    const webScraper = new WebScraperService();
    webScraper.process()
        .then(msg => {
            console.log(msg)
            res.status(200);
        });
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
    open(`http://localhost:${port}/test`);
});