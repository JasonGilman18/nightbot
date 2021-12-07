const fetch = require("node-fetch");
const tmi = require("tmi.js");
const cron = require("node-cron");
const ResponseService = require("./ResponseService");

module.exports = class BotService {
    
    credService;
    responseService;
    client;
    scheduledMessagesRunning;

    constructor(credentialService) {
        this.credService = credentialService;
        this.responseService = new ResponseService();
        this.client = new tmi.Client();
        this.scheduledMessagesRunning = false;
    }

    process() {
        this.getAccessTokenFromTwtich()
            .then(accessToken => this.constructClient())
            .then(client => this.setClient(client))
            .then(client => this.setupBot());
    }
    
    getAccessTokenFromTwtich() {
        return fetch(this.credService.buildTwitchAccessTokenURL(), {method: "POST"})
            .then(response => response.json())
            .then(response => response.access_token)
            .then(accessToken => {
                this.credService.setAccessToken(accessToken);
                return accessToken;
            });
    }

    constructClient() {
        return new tmi.Client({
            connection: {
                secure: true,
                reconnect: true
            },
            identity: {
                username: this.credService.BOT_USERNAME,
                password: this.credService.TWITCH_ACCESS_TOKEN
            },
            channels: [ this.credService.CHANNEL_NAME ]
        });
    }

    setClient(client) {
        this.client = client;
        return this.client;
    }

    setupBot() {
        this.client.connect()
            .then( (data) => {
                this.client.on('join', (channel, username, self) => {
                    if(self && !this.scheduledMessagesRunning) {
                        this.respondWithBot("JOIN_MSG_RESPONSE", this.responseService.getJoinMsgResponse(), "etherealisme_bot", "", channel)
                        this.startScheduledMessages(channel);
                    }
                });

                this.client.on('message', (channel, tags, message, self) => {
                    if(self)
                        return;
                    
                    switch(message) {
                        case "!bot":
                            this.respondWithBot("WELCOME_MSG_RESPONSE", this.responseService.getWelcomeMsgResponse(), tags["username"], message, channel);
                            break;
                        case "!random":
                            this.responseService.getRandomMsgResponse()
                                .then(msg => this.respondWithBot("RANDOM_MSG_RESPONSE", msg, tags["username"], message, channel));
                            break;
                        default:
                            this.processLog(true, tags["username"], message);
                            break;
                    }
                });
            });
    }

    respondWithBot(processName, responseMessage, triggerUsername, triggerMessage, channel) {
        return this.client.say(channel, "" + responseMessage)
            .then( (data) => {
                this.processLog(data[0] == channel && responseMessage, processName, triggerUsername, triggerMessage);
            })
            .catch( (err) => {
                this.processLog(false, processName, triggerUsername, triggerMessage);
            });
    }

    processLog(ok, processName, triggerUsername, triggerMessage) {
        const now = new Date();
        console.log(`[${now.toTimeString()}] ${processName} has ${ok ? "FINISHED" : "FAILED"} after being triggered by user \"${triggerUsername}\" with message \"${triggerMessage}\".\n`);
    }

    startScheduledMessages(channel) {
        const interval_minutes = 10;
        this.scheduledMessagesRunning = true;
        cron.schedule(`*/${interval_minutes} * * * *`, () => {
            this.respondWithBot(this.responseService.getScheduledMsgResponse(), "", "", channel);
        }).start();
    }
}