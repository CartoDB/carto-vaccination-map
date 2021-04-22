import { DARK_MATTER } from '@carto/react-basemaps';

export const initialState = {
  viewState: {
    latitude: 40.75,
    longitude: -73.94,
    zoom: 12,
    pitch: 0,
    bearing: 0,
    dragRotate: false,
  },
  basemap: DARK_MATTER,
  credentials: {
    username: 'public',
    apiKey: 'default_public',
    serverUrlTemplate: 'https://{user}.carto.com',
  },
  googleApiKey: '', // only required when using a Google Basemap
};

export const oauthInitialState = {
  oauthApp: {
    clientId: 'TYPE HERE YOUR OAUTH CLIENT ID',
    scopes: [
      'user:profile', // to load avatar photo
    ],
    authorizeEndPoint: 'https://carto.com/oauth2/authorize', // only valid if keeping https://localhost:3000/oauthCallback
  },
  token: null,
  userInfo: null,
};
