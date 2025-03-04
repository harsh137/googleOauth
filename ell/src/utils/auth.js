



import {authorize , refresh } from 'react-native-app-auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {GOOGLE_OAUTH_APP_GUID , CLIENT_SECRET} from '@env';





const SCOPES= [  "https://www.googleapis.com/auth/gmail.readonly",
  "https://www.googleapis.com/auth/gmail.send",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",]

  

// const insertUser = async (data) => {
//   try {
//     const response = await fetch("http://10.24.211.62:3002/api/insert-user", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
        
//         refresh_token: data.refreshToken,
//         id_token: data.idToken,
//       }),
//     });

//     if (!response.ok) {
//       throw new Error("Failed to insert user");
//     }

//     const result = await response.json();
//     console.log("User inserted successfully:", result);
//   } catch (error) {
//     console.error("Error inserting user:", error);
//   }
// };


export const authenticateUser = async () => {
  const config = {
    issuer: 'https://accounts.google.com',
    clientId: `${GOOGLE_OAUTH_APP_GUID}.apps.googleusercontent.com`,
    clientSecret:CLIENT_SECRET,
    redirectUrl: `com.googleusercontent.apps.${GOOGLE_OAUTH_APP_GUID}:/oauth2redirect/google`,
    scopes: SCOPES,
   };
    
    const authState = await authorize(config);


        console.log(`Hello ${JSON.stringify(authState)}`);
        // await insertUser(authState);

    return {
      accessToken: authState.accessToken,
      idToken: authState.idToken,
      refreshToken:authState.refreshToken,
      expiryTime: authState.accessTokenExpirationDate,
      
    };
  };

  export const newAccessToken = async (idToken)=>{
    const response = await fetch("http://10.24.211.62:3002/api/refresh", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },

    });
    const data = await response.json();
    console.log(data)
         
       
  }
  