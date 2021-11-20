export default class CredentialService {
  static TWITCH_AUTHORIZATION_ENDPOINT = 'https://id.twitch.tv/oauth2/authorize';
  
  static TWITCH_TOKEN_URL = 'https://id.twitch.tv/oauth2/token';

  constructor(clientId, clientSecret, redirectUri, scope, channelName, botUsername) {
    this.TWITCH_CLIENT_ID = clientId;
    this.TWITCH_CLIENT_SECRET = clientSecret;
    this.TWITCH_REDIRECT_URI = redirectUri;
    this.TWITCH_AUTH_CODE = '';
    this.TWITCH_ACCESS_TOKEN = '';
    this.TWITCH_SCOPE = scope;
    this.CHANNEL_NAME = channelName;
    this.BOT_USERNAME = botUsername;
  }

  setAuthCode(authCode) {
    this.TWITCH_AUTH_CODE = authCode;
  }

  setAccessToken(accessToken) {
    this.TWITCH_ACCESS_TOKEN = accessToken;
  }

  buildTwitchAuthorizationURL() {
    return CredentialService.TWITCH_AUTHORIZATION_ENDPOINT + "?" + 
      "client_id=" + this.TWITCH_CLIENT_ID + 
      "&redirect_uri=" + this.TWITCH_REDIRECT_URI + 
      "&response_type=code" + 
      "&scope=" + this.TWITCH_SCOPE;
  }

  buildTwitchAccessTokenURL() {
    return CredentialService.TWITCH_TOKEN_URL + "?" + 
      "client_id=" + this.TWITCH_CLIENT_ID + 
      "&client_secret=" + this.TWITCH_CLIENT_SECRET + 
      "&code=" + this.TWITCH_AUTH_CODE + 
      "&grant_type=authorization_code" +
      "&redirect_uri=" + this.TWITCH_REDIRECT_URI;
  }
}