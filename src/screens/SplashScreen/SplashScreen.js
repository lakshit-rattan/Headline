import React, { useEffect } from 'react';
import { View, Image } from 'react-native';
import styles from './styles';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (navigation) {
        navigation.replace('NewsFeed');
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/images/splash.png')} style={styles.logo} resizeMode="contain" />
    </View>
  ); 
}; 



export default SplashScreen;
