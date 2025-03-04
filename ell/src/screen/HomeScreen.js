import React, { useState , useEffect} from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';

import { authenticateUser , newAccessToken} from '../utils/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Card, Title, Paragraph } from 'react-native-paper';
import { Image } from 'react-native';

export default function HomeScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
   useEffect(()=>{
    const checkAuth = async () => {
      const screen = await AsyncStorage.getItem('screen');
      if (screen) {
        navigation.navigate('Dashboard' , {screen});
      }
    };
    checkAuth();
  },[]);

  const handleLogin = async (screen) => {
    try {
    const accessToken = await AsyncStorage.getItem('AccessToken');
    const idToken = await AsyncStorage.getItem('idToken');
    const expiryTime = await AsyncStorage.getItem('expiryTime');
    if (accessToken && idToken && expiryTime) {
      if (new Date(expiryTime) > new Date()) {

      navigation.navigate('Dashboard', { screen: screen });
      return;
      }
      else{
        const idToken=await AsyncStorage.getItem('idToken');
        
        
        const newToken=await newAccessToken(idToken);
        if(newToken.accessToken && newToken.idToken){
          await AsyncStorage.setItem('AccessToken', newToken.accessToken);
          await AsyncStorage.setItem('idToken', newToken.idToken);
          await AsyncStorage.setItem('expiryTime', newToken.expiryTime);
          await AsyncStorage.setItem('screen', screen);
          navigation.navigate('Dashboard',{screen: screen});}
          return;
      }

    }
    
      setLoading(true);
      const tokens = await authenticateUser();
      if (tokens?.accessToken && tokens?.idToken) {
        await AsyncStorage.setItem('AccessToken', tokens.accessToken);
        await AsyncStorage.setItem('idToken', tokens.idToken);
        await AsyncStorage.setItem('expiryTime', tokens.expiryTime);
        await AsyncStorage.setItem('screen', screen);
        navigation.navigate('Dashboard',{screen: screen});
      } else {
        Alert.alert('Authentication Failed', 'No tokens received. Please try again.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      Alert.alert('Login Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#6200EE" />
      ) : (
        <>
          <Card style={styles.card} onPress={()=>handleLogin('gmail')}>
            <Card.Content>
              <Image source={require('../../assets/gmail.png')} style={styles.logo} />
              <Title>Login with Gmail</Title>
              <Paragraph>Access your Gmail account</Paragraph>
            </Card.Content>
          </Card>
          
          <Card style={styles.card} onPress={()=>handleLogin('drive')}>
            <Card.Content>
              <Image source={require('../../assets/drive.png')} style={styles.logo} />
              <Title>Login with Drive</Title>
              <Paragraph>Access your Google Drive account</Paragraph>
            </Card.Content>
          </Card>
        </>
      )}
    </View>
  );
};
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    card: {
      margin: 10,
      width: '80%',
    },
    logo: {
      width: 50,
      height: 50,
      marginBottom: 10,
    },
  });