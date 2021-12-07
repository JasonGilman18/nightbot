const WebScraperService = require("./WebScraperService");

module.exports = class RespnseService {

    JOIN_MSG_RESPONSE = "Welcome to the stream!\n\nTry out the new bot commands \"!bot\" and \"!random\".";
    WELCOME_MSG_RESPONSE = "Welcome to the stream!";
    SCHEDULED_MSG_RESPONSE = "Beep Boop";
    webScraperService;

    constructor() {
        this.webScraperService = new WebScraperService();
    }

    getJoinMsgResponse() {
        return this.JOIN_MSG_RESPONSE;
    }

    getWelcomeMsgResponse() {
        return this.WELCOME_MSG_RESPONSE;
    }

    getScheduledMsgResponse() {
        return this.SCHEDULED_MSG_RESPONSE;
    }

    getRandomMsgResponse() {
        return this.webScraperService.process();
    }

}