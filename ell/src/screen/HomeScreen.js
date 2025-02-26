import React, { useState , useEffect} from 'react';
import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';

import { authenticateUser } from '../utils/auth';
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

  const handleLogin = async () => {
    try {
    const accessToken = await AsyncStorage.getItem('gmailAccessToken');
    const idToken = await AsyncStorage.getItem('idToken');
    if (accessToken && idToken) {
      navigation.navigate('Dashboard', { screen: 'gmail' });
      return;
    }
      setLoading(true);
      const tokens = await authenticateUser('gmail');
      if (tokens?.accessToken && tokens?.idToken) {
        await AsyncStorage.setItem('gmailAccessToken', tokens.accessToken);
        await AsyncStorage.setItem('idToken', tokens.idToken);
        await AsyncStorage.setItem('screen', 'gmail');
        navigation.navigate('Dashboard',{screen: 'gmail'});
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
  const handleDriveLogin = async () => {
    try {
      const accessToken = await AsyncStorage.getItem('driveAccessToken');
    const idToken = await AsyncStorage.getItem('idToken');
    
    if (accessToken && idToken) {
      navigation.navigate('Dashboard', { screen: 'drive' });
      return;
    }
      setLoading(true);
      const tokens = await authenticateUser('drive');
      if (tokens?.accessToken && tokens?.idToken) {
        await AsyncStorage.setItem('driveAccessToken', tokens.accessToken);
        await AsyncStorage.setItem('idToken', tokens.idToken);
        await AsyncStorage.setItem('screen', 'drive');
        navigation.navigate('Dashboard',{screen: 'drive'});
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
          <Card style={styles.card} onPress={handleLogin}>
            <Card.Content>
              <Image source={require('../../assets/gmail.png')} style={styles.logo} />
              <Title>Login with Gmail</Title>
              <Paragraph>Access your Gmail account</Paragraph>
            </Card.Content>
          </Card>
          
          <Card style={styles.card} onPress={handleDriveLogin}>
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