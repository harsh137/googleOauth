import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { WebView } from 'react-native-webview';
import { Appbar } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';

const DashboardScreen = ({ navigation , }) => {
  const route=useRoute();
  const screen=route.params?.screen;
  console.log(screen);

  const [access_token, setAccess_token] = useState(null);
  const [id_token, setId_token] = useState(null);
  const webViewRef = useRef(null);

  useEffect(() => {
    const fetchToken = async () => {
      setAccess_token(await AsyncStorage.getItem(screen==='gmail'?'gmailAccessToken':'driveAccessToken'));
      setId_token(await AsyncStorage.getItem('idToken'));
    };

    fetchToken();

  }, []);

  const inject = () => {
    if (webViewRef.current && access_token && id_token) {
      const injectJavaScript = `
        (function() {
          window.isNativeApp = true;
          window.localStorage.setItem('access_token', '${access_token}');
          window.localStorage.setItem('id_token', '${id_token}');
          window.localStorage.setItem('is_webview', '${true}');
          document.dispatchEvent(new Event('authTokenSet'));
        })();
        true;
      `;
      webViewRef.current.injectJavaScript(injectJavaScript);
    }
  };

  const handleSendMail = () => {
    if (webViewRef.current) {
      const injectJavaScript = `
        (function() {
          window.dispatchEvent(new CustomEvent('openSendModal', { detail: true }));
        })();
        true;
      `;
      webViewRef.current.injectJavaScript(injectJavaScript);
    }
  };
  const handleRefresh = () => {
    if (webViewRef.current) {
      const injectJavaScript = `
        (function() {
          window.dispatchEvent(new CustomEvent('refreshPage', { detail: true }));
        })();
        true;
      `;
      webViewRef.current.injectJavaScript(injectJavaScript);
    }
  };
    

  const handleLogout = () => {
    if (webViewRef.current) {
      const injectJavaScript = `
        (function() {
          window.localStorage.removeItem('access_token');
          window.localStorage.removeItem('id_token');
          window.localStorage.removeItem('is_webview');
          window.dispatchEvent(new CustomEvent('logout'));
        })();
        true;
      `;
      webViewRef.current.injectJavaScript(injectJavaScript);
    }
    AsyncStorage.removeItem(screen==='gmail'?'gmailAccessToken':'driveAccessToken');
    
    // AsyncStorage.removeItem('idToken');
    AsyncStorage.removeItem('screen');
    navigation.navigate('Home'); 
  };

  const [webViewTitle, setWebViewTitle] = useState('Dashboard');

  const handleNavigationStateChange = (navState) => {
      console.log(navState.url);
    if (navState.url.includes('gmail')) {
      setWebViewTitle('Gmail Dashboard');
    } else if (navState.url.includes('drive')) {
      setWebViewTitle('Drive Dashboard');
    } else {
      setWebViewTitle('Dashboard');
    }
  };
  const NaviBack = () => {
    AsyncStorage.removeItem('screen');
    navigation.navigate('Home');
  }

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.BackAction onPress={NaviBack} />
       
        
        <Appbar.Content title={webViewTitle} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
        <Appbar.Action icon={webViewTitle==='Gmail Dashboard'?"email":"refresh"} onPress={webViewTitle==='Gmail Dashboard'?handleSendMail:handleRefresh} />
        
      </Appbar.Header>
      {access_token ? (
        <WebView
          ref={webViewRef}
          source={{ uri: `http://10.24.209.93:3000/${screen}` }}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          onLoadEnd={inject}
          webviewDebuggingEnabled={true}
          onNavigationStateChange={handleNavigationStateChange}
          renderLoading={() => <ActivityIndicator size="large" color="green" style={styles.loader} />}
        />
      ) : (
        <ActivityIndicator size="large" color="yellow" style={styles.loader} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { position: 'absolute', top: '50%', left: '50%', marginLeft: -25, marginTop: -25 }
});

export default DashboardScreen;
