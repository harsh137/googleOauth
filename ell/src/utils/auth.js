
import {authorize , refresh } from 'react-native-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GOOGLE_OAUTH_APP_GUID , CLIENT_SECRET} from '@env';


// const GOOGLE_OAUTH_APP_GUID ='1055020860498-p5d4ubmvli1915l6biukbc7p6shu3tr7';
const SCOPES_GMAIL= [  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",]

const SCOPES_DRIVE= [  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",]

export const authenticateUser = async (screen) => {
  const config = {
    issuer: 'https://accounts.google.com',
    clientId: `${GOOGLE_OAUTH_APP_GUID}.apps.googleusercontent.com`,
    clientSecret:CLIENT_SECRET,
    redirectUrl: `com.googleusercontent.apps.${GOOGLE_OAUTH_APP_GUID}:/oauth2redirect/google`,
    scopes: screen==='gmail'?SCOPES_GMAIL:SCOPES_DRIVE,
   };
  
    
        console.log(`Hello${process.env.GOOGLE_OAUTH_APP_GUID}`);
        const authState = await authorize(config);
        // console.log(`Hello ${JSON.stringify(authState)}`);
     


    return {
      accessToken: authState.accessToken,
      idToken: authState.idToken,
      refreshToken:authState.refreshToken
    };
  };

  export const newAccessToken = async (screen)=>{
    const config = {
      issuer: 'https://accounts.google.com',
      clientId: `${GOOGLE_OAUTH_APP_GUID}.apps.googleusercontent.com`,
      clientSecret:CLIENT_SECRET,
      redirectUrl: `com.googleusercontent.apps.${GOOGLE_OAUTH_APP_GUID}:/oauth2redirect/google`,
      scopes: screen==='gmail'?SCOPES_GMAIL:SCOPES_DRIVE,
     };
    const rt=await AsyncStorage.getItem('refreshToken');
    if (!rt) {
      console.error("Error: Refresh token not found in AsyncStorage.");
      return null;
    }
  
    console.log("Refresh Token:", rt);
    console.log(rt);
    
    const result = await refresh( config, {
      refreshToken: rt,
    });
    console.log(result);
    
    return result
  }