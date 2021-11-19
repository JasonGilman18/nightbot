import { BotService } from "../BotService";
import { CredentialBuilder } from "../CredentialBuilder";
import { BOT_USERNAME, CHANNEL_NAME, TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, TWITCH_REDIRECT_URI, TWITCH_SCOPE} from "../credentials";

function startBot() {
    const creds = new CredentialBuilder(TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, 
        TWITCH_REDIRECT_URI, TWITCH_SCOPE, CHANNEL_NAME, BOT_USERNAME);
    const service = new BotService(creds);
    service.process();
}