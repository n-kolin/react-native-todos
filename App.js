import React from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TaskList from './src/components/TaskList';
import AddTask from './src/components/AddTask';
import SplashScreen from './src/components/SplashScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="SplashScreen">
            <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
            <Stack.Screen name="TaskList" component={TaskList} />
            <Stack.Screen name="AddTask" component={AddTask} />
          </Stack.Navigator>
        </NavigationContainer>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}