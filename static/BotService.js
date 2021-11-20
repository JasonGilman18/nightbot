import fetch from "node-fetch";
import tmi from 'tmi.js';
import WebScraperService from "./WebScraperService.js";

export default class BotService {
    
    credService;
    client;
    webScraperService;

    constructor(credentialService) {
        this.credService = credentialService;
        this.client = new tmi.Client();
        this.webScraperService = new WebScraperService();
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
                this.client.on('connected', (address, port) => {
                    console.log("\n\nBOT IS CONNECTED\n\n");
                });
                
                this.client.on('message', (channel, tags, message, self) => {
                    if(self)
                        return;
                    
                    switch(message) {
                        case "!bot":
                            this.welcomeMessageResponse(channel, tags, message);
                            break;
                        case "!random":
                            this.randomMessageResponse(channel, tags, message);
                            break;
                        default:
                            this.startLog(tags['display-name'], "NONE", message);
                            break;
                    }
                });
            });
    }

    welcomeMessageResponse(channel, tags, message) {
        this.startLog(tags['display-name'], "WELCOME_MSG_RESPONSE", message);
        this.respondWithBot("Welcome to the stream!", channel)
            .then(ok => this.endLog("WELCOME_MSG_RESPONSE", ok));
    }

    randomMessageResponse(channel, tags, message) {
        this.startLog(tags['display-name'], "RANDOM_MSG_RESPONSE", message);
        this.webScraperService.process()
            .then(msg => {
                this.respondWithBot(msg, channel)
                    .then(ok => this.endLog("RANDOM_MSG_RESPONSE", ok));
            });
    }

    respondWithBot(msg, channel) {
        this.startLog("e__thereal_bot", "NONE", msg);
        return this.client.say(channel, msg)
            .then( (data) => {
                return data[0] == channel && data[1] == msg;
            })
            .catch( (err) => {
                return false;
            });
    }

    startLog(sender, action, msg) {
        console.log(`SENDER: ${sender}\nSTARTING ACTION: ${action}\nMSG: ${msg}\n`);
    }

    endLog(action, ok) {
        console.log(`ENDING ACTION: ${action}\nSTATUS: ${ok ? "OK" : "ERROR"}`);
    }
}