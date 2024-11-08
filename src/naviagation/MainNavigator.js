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
import PaymentSuccess from '../screens/PaymentSuccess';
import PartnerTabNavigator from './PartnerTabNavigator';
import SignUp from '../component/Login/SignUp';
import Login from '../component/Login/Login';
import ManageCategoriesScreen from '../Partner/src/screens/ManageCategoriesScreen';
import AddDishScreen from '../Partner/src/screens/AddDishScreen';
import EditDishScreen from '../Partner/src/screens/EditDishScreen';

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

        <Stack.Screen
          name="Partner"
          component={PartnerTabNavigator}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen name="Login" component={LoginScreen} />

        <Stack.Screen
          name="SignUp"
          component={SignUp}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />

        <Stack.Screen
          name="SignIn"
          component={Login}
          options={{
            headerShown: false,
            useNativeDriver: true,
            gestureEnabled: false,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
          }}
        />

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

        <Stack.Screen
          name="PaymentSuccess"
          component={PaymentSuccess}
          options={{
            headerShown: false,
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
        <Stack.Screen
          name="ManageCategories"
          component={ManageCategoriesScreen}
          options={{
            headerShown: true,
            headerTitle: 'Quản lý danh mục',
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
          name="AddDishScreen"
          component={AddDishScreen}
          options={{
            headerShown: true,
            headerTitle: 'Quản lý danh mục',
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
          name="EditDishScreen"
          component={EditDishScreen}
          options={{
            headerShown: true,
            headerTitle: 'Chỉnh sửa món ăn',
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
