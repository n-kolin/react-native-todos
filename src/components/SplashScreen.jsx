import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    setTimeout(() => {
      navigation.replace('TaskList'); 
    }, 3000);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../../assets/list.jpg')} style={styles.logo} />
      <Text style={styles.text}>Welcome to Task Manager</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6200ee',
  },
  logo: {
    width: 250,
    height: 250,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default SplashScreen;