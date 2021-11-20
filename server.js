import express from 'express';
import ejs from 'ejs';
import open from 'open';
import CredentialService from './static/CredentialService.js';
import { 
    BOT_USERNAME, 
    CHANNEL_NAME, 
    TWITCH_CLIENT_ID, 
    TWITCH_CLIENT_SECRET, 
    TWITCH_REDIRECT_URI, 
    TWITCH_SCOPE
} from "./credentials.js";
import BotService from './static/BotService.js';

const server = express();
server.engine('html', ejs.renderFile);
const port = 3000;
const credService = new CredentialService(TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, 
    TWITCH_REDIRECT_URI, TWITCH_SCOPE, CHANNEL_NAME, BOT_USERNAME);

server.get('/', (req, res) => {
    res.redirect(credService.buildTwitchAuthorizationURL());
});

server.get('/redirect', (req, res) => {
    const authCode = req.query.code;
    credService.setAuthCode(authCode);
    const bot = new BotService(credService);
    bot.process();
    res.render("./bot.html");
});

server.listen(port, () => {
    open(`http://localhost:${port}`);
});