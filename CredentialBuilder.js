export default class CredentialBuilder {
  static TWITCH_AUTHORIZATION_ENDPOINT = 'https://id.twitch.tv/oauth2/authorize';
  
  static TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token';

  constructor(clientId, clientSecret, redirectUri, scope, channelName, botUsername) {
    this.TWITCH_CLIENT_ID = clientId;
    this.TWITCH_CLIENT_SECRET = clientSecret;
    this.TWITCH_REDIRECT_URI = redirectUri;
    this.TWITCH_AUTH_CODE = '';
    this.TWITCH_SCOPE = scope;
    this.CHANNEL_NAME = channelName;
    this.BOT_USERNAME = botUsername;
  }

  setAuthCode(authCode) {
    this.TWITCH_AUTH_CODE = authCode;
  }

  buildTwitchAuthorizationURL() {
    return CredentialBuilder.TWITCH_AUTHORIZATION_ENDPOINT + "?" + 
      "client_id=" + this.TWITCH_CLIENT_ID + 
      "&redirect_uri=" + this.TWITCH_REDIRECT_URI + 
      "&response_type=code" + 
      "&scope=" + this.TWITCH_SCOPE;
  }
  
  buildTwitchAccessTokenURL() {
    return CredentialBuilder.TWITCH_TOKEN_URL + "?" + 
      "client_id=" + this.TWITCH_CLIENT_ID + 
      "&client_secret=" + this.TWITCH_CLIENT_SECRET + 
      "&code=" + this.TWITCH_OAUTH_CODE + 
      "&grant_type=authorization_code" +
      "&redirect_uri=" + this.TWITCH_REDIRECT_URI;
  }
}



// const TWITCH_AUTH_CODE = await fetch(TWITCH_AUTHORIZATION_ENDPOINT, {method: "GET"})
//         .then(response => response.json());

// console.log(TWITCH_AUTH_CODE);

// const TWITCH_ACCESS_TOKEN = await fetch(TWITCH_TOKEN_URL, {method: "POST"})
//         .then(response => response.json())
//         .then(response => response.access_token);

// const client = new tmi.Client({
//     connection: {
//       secure: true,
//       reconnect: true
//     },
//     identity: {
//         username: BOT_USERNAME,
//         password: TWITCH_ACCESS_TOKEN
//     },
//     channels: [ CHANNEL_NAME ]
// });

// client.connect();

// client.on('connected', (channel, tags, message, self) => {
//     //client.say(channel, "Hello!");
//     console.log(`${message}`);
// });

// client.on('message', (channel, tags, message, self) => {
//   console.log(`${tags['display-name']}: ${message}`);
  
//   //client.say(channel, "am i working???")
//   //if(message == "hello")
//   //  client.say(channel, "A bot speaks...");
// });