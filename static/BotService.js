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
                            console.log(`SENDER: ${tags['display-name']}\nACTION: WELCOME_MSG_RESPONSE\nMSG: ${message}\n`);
                            this.respondWithBot("Welcome to the stream!", channel);
                            break;
                        case "!random":
                            console.log(`SENDER: ${tags['display-name']}\nACTION: RANDOM_MSG_RESPONSE\nMSG: ${message}\n`);
                            this.webScraperService.process()
                                .then(msg => this.respondWithBot(msg, channel));
                            break;
                        default:
                            console.log(`SENDER: ${tags['display-name']}\nACTION: NONE\nMSG: ${message}\n`);
                            break;
                    }
                });
            });
    }

    respondWithBot(msg, channel) {
        console.log(`SENDER: e__thereal_bot\nACTION: NONE\nMSG: ${msg}\n`);
        this.client.say(channel, msg);
    }
}