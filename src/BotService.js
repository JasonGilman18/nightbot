const fetch = require("node-fetch");
const tmi = require("tmi.js");
const cron = require("node-cron");
const WebScraperService = require("./WebScraperService");

module.exports = class BotService {
    
    credService;
    client;
    webScraperService;
    scheduledMessagesRunning;

    constructor(credentialService) {
        this.credService = credentialService;
        this.client = new tmi.Client();
        this.webScraperService = new WebScraperService();
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
                        this.joinMessageResponse(channel, username);
                        this.startScheduledMessages(channel);
                    }
                });

                this.client.on('message', (channel, tags, message, self) => {
                    if(self)
                        return;
                    
                    switch(message) {
                        case "!bot":
                            this.welcomeMessageResponse(channel, tags["username"], message);
                            break;
                        case "!random":
                            this.randomMessageResponse(channel, tags["username"], message);
                            break;
                        default:
                            this.processLog(true, "INCOMING_CHAT_MSG", tags["username"], message);
                            break;
                    }
                });
            });
    }

    joinMessageResponse(channel, username) {
        this.respondWithBot("Welcome to the stream!\n\nTry out the new bot commands \"!bot\" and \"!random\"", channel)
            .then(ok => this.processLog(ok, "JOIN_MSG_RESPONSE", username, ""));
    }

    welcomeMessageResponse(channel, username, message) {
        this.respondWithBot("Welcome to the stream!", channel)
            .then(ok => this.processLog(ok, "WELCOME_MSG_RESPONSE", username, message));
    }

    randomMessageResponse(channel, username, message) {
        this.webScraperService.process()
            .then(msg => {
                this.respondWithBot(msg, channel)
                    .then(ok => this.processLog(ok, "RANDOM_MSG_RESPONSE", username, message));
            });
    }

    respondWithBot(msg, channel) {
        return this.client.say(channel, msg)
            .then( (data) => {
                return data[0] == channel && data[1] == msg;
            })
            .catch( (err) => {
                return false;
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
            this.respondWithBot("Beep Boop", channel)
                .then(ok => this.processLog(ok, "SCHEDULED_MSG_RESPONSE", "", ""));
        }).start();
    }
}