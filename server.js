const express = require("express");
const ejs = require("ejs");
const open = require("open");
const path = require("path");
const CredentialService = require("./src/CredentialService");
const credentials = require("./src/credentials");
const BotService = require("./src/BotService");

const server = express();
server.engine('html', ejs.renderFile);
server.use(express.static("src"));
const port = 3000;
const credService = new CredentialService(credentials.TWITCH_CLIENT_ID, credentials.TWITCH_CLIENT_SECRET, 
    credentials.TWITCH_REDIRECT_URI, credentials.TWITCH_SCOPE, credentials.CHANNEL_NAME, credentials.BOT_USERNAME);

server.get('/', (req, res) => {
    res.redirect(credService.buildTwitchAuthorizationURL());
});

server.get('/redirect', (req, res) => {
    const authCode = req.query.code;
    credService.setAuthCode(authCode);
    const bot = new BotService(credService);
    bot.process();
    res.render(path.join(__dirname, "src", "bot.html"));
});

server.listen(port, () => {
    open(`http://localhost:${port}`);
    console.log("\nBOT IS RUNNING\n");
    console.log("Once authenticated in your browser, chat messages will appear here.\n\n");
});