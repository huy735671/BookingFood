import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import ListFood from '../component/Home/ListFood';
import DishDetail from '../component/Food/DishDetail';
import MenuDish from '../component/Food/MenuDish';
import OrderDetails from '../component/Oder/OderDetails';

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
        <Stack.Screen
          name="MenuDish"
          component={MenuDish}
          options={{
            headerShown: false,
            headerTitle: 'Thực đơn quán',
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: 'black',
          }}
        />
        <Stack.Screen
          name="DishDetail"
          component={DishDetail}
          options={{
            headerShown: false,
            headerTitle: 'Chi tiết món ăn',
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: 'black',
          }}
        />

        <Stack.Screen
          name="OrderDetails"
          component={OrderDetails}
          options={{
            headerShown: true,
            headerTitle: 'Thanh toán đơn hàng',
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#fff',
            },
            headerTintColor: 'black',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
