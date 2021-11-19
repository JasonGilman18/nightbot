import fetch from "node-fetch";
import { CredentialBuilder } from "./CredentialBuilder";

export class BotService {

    constructor(credentialBuilder) {
        this.creds = credentialBuilder;
    }

    process() {
        this.getAccessTokenFromTwtich()
            .then()
    }
    
    getAccessTokenFromTwtich() {
        return fetch(this.creds.buildTwitchAccessTokenURL(), {method: "POST"})
            .then(response => response.json())
            .then(response => response.access_token);
    }


}