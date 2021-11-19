import fetch from "node-fetch";
import tmi from 'tmi.js';

export class BotService {
    
    creds;

    constructor(credentialBuilder) {
        this.creds = credentialBuilder;
    }

    process() {
        this.getAccessTokenFromTwtich()
            .then(accessToken => this.constructClient(accessToken))
            .then(client => this.setupBot(client));
    }
    
    getAccessTokenFromTwtich() {
        return fetch(this.creds.buildTwitchAccessTokenURL(), {method: "POST"})
            .then(response => response.json())
            .then(response => response.access_token)
            .then(accessToken => {
                this.creds.setAccessToken(accessToken);
                return accessToken;
            });
    }

    constructClient(accessToken) {
        return new tmi.Client({
            connection: {
                secure: true,
                reconnect: true
            },
            identity: {
                username: this.creds.BOT_USERNAME,
                password: this.creds.TWITCH_ACCESS_TOKEN
            },
            channels: [ this.creds.CHANNEL_NAME ]
        });
    }

    setupBot(client) {
        client.connect();
        client.on('connected', (channel, tags, message, self) => {
            //client.say(channel, "Hello!");
            console.log(`${message}`);
        });
            
        client.on('message', (channel, tags, message, self) => {
            console.log(`${tags['display-name']}: ${message}`);
            
            //client.say(channel, "am i working???")
            //if(message == "hello")
            //  client.say(channel, "A bot speaks...");
        });
    }
}