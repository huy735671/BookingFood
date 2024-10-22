import React from 'react';
import {CardStyleInterpolators, createStackNavigator} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import ListFood from '../component/Home/ListFood';

const Stack = createStackNavigator();

const MainNavigator = () => {
  return (
    <NavigationContainer>

      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{headerShown: false}}>

        <Stack.Screen
          name="Root"
          component={TabNavigator}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen name="Login" component={LoginScreen} />



        <Stack.Screen
          name="ListFood"
          component={ListFood}
          options={{
            headerShown: true,
            useNativeDriver: true,
            gestureEnabled: true,
            headerTitle: '',
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
