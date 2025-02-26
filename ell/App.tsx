// import React , {} from 'react';
// import {View, Button, StyleSheet} from 'react-native';
// import {authorize} from 'react-native-app-auth';
// import { Platform } from 'react-native';
// const App = () => {
//   // const GOOGLE_OAUTH_APP_GUID =
//   //   '1055020860498-3nvgbsj79h55umdnq8aosobvk1cus4sa';
//   //  const IOS_CLIENT_ID = '1055020860498-p5d4ubmvli1915l6biukbc7p6shu3tr7';
//   // const config = {
//   //   issuer: 'https://accounts.google.com',
//   //   clientId: `${GOOGLE_OAUTH_APP_GUID}.apps.googleusercontent.com`,
//   //   redirectUrl: `com.googleusercontent.apps.${GOOGLE_OAUTH_APP_GUID}:/oauth2redirect/google`,
//   //   scopes: ['openid', 'profile','email'],
//   // };

//   // const configios = {
//   //     issuer: 'https://accounts.google.com',
//   //     clientId: `${IOS_CLIENT_ID}.apps.googleusercontent.com`,
//   //     redirectUrl: `com.googleusercontent.apps.${IOS_CLIENT_ID}:/oauth2redirect/google`,
//   //     scopes: ['openid', 'profile','email'],
//   //   };

//   // const auth = async () => {
//   //   console.log('Hello');
//   //   const authState = await authorize(Platform.OS === 'ios' ? configios : config);
//   //   console.log(`Hello ${JSON.stringify(authState)}`);
//   // };
  
  
//   // const refreshedState = await refresh(config, {
//   //   refreshToken: authState.refreshToken,
//   // });
//   // await revoke(config, {
//   //   tokenToRevoke: refreshedState.refreshToken,
//   // });
//   return (
//     <View style={styles.container}>
//       <Button title="Sign in" onPress={auth} />
//     </View>
//   );
// };
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });
// export default App;



import * as React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import MainNavigator from './src/navigation/MainNavigator';

export default function App() {
  return (
    <PaperProvider>
      <MainNavigator />
    </PaperProvider>
  );
}
