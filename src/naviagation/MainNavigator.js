import React from 'react';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import {NavigationContainer} from '@react-navigation/native';
import LoginScreen from '../screens/LoginScreen';
import TabNavigator from './TabNavigator';
import SignUp from '../component/Login/SignUp';
import Login from '../component/Login/Login';
import ProfileScreen from '../component/Profile/ProfileScreen';
import MenuNavigator from './MenuNavigator';
import AddUserScreen from '../Admin/component/Manage/AddUserScreen';
import EditUserScreen from '../Admin/component/Manage/EditUserScreen';
import CreateEventScreen from '../Admin/component/Manage/Home/CreateEventScreen';
import TaskFormScreen from '../Admin/component/Manage/Home/TaskFormScreen';
import ConfirmTaskScreen from '../component/ConfirmTaskScreen';
import CreateGroupScreen from '../component/Group/CreateGroupScreen';
import GroupDetailScreen from '../component/Group/GroupDetailScreen';
import CreateEvent from '../component/Group/GroupTab/CreateEvent';
import EventDetailScreen from '../component/Group/EventDetailScreen';
import EventDetails from '../component/Food/EvenDetails/EventDetails';
import GiftScreen from '../component/Food/Gift/GiftScreen';
import CreateGiftScreen from '../Admin/component/Manage/GiftManage/CreateGiftScreen';
import HistoryScreen from '../component/Food/Gift/HistoryScreen';

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
          name="Admin"
          component={MenuNavigator}
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
          name="CreateEventScreen"
          component={CreateEventScreen}
          options={{
            headerShown: true,
            headerTitle: 'Tạo sự kiện mới',
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="GiftScreen"
          component={GiftScreen}
          options={{
            headerShown: true,
            headerTitle: 'Đổi điểm EcoWarriors',
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="TaskFormScreen"
          component={TaskFormScreen}
          options={{
            headerShown: true,
            headerTitle: 'Chỉnh sửa nhiệm vụ',
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="ConfirmTaskScreen"
          component={ConfirmTaskScreen}
          options={{
            headerShown: false,
            headerTitle: 'Chỉnh sửa nhiệm vụ',
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="CreateGroupScreen"
          component={CreateGroupScreen}
          options={{
            headerShown: true,
            headerTitle: 'Tạo nhóm mới',
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen
          name="CreateEvent"
          component={CreateEvent}
          options={{
            headerShown: true,
            headerTitle: 'Tạo sự kiện mới cho nhóm',
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="EventDetailScreen"
          component={EventDetailScreen}
          options={{
            headerShown: true,
            headerTitle: 'Chi tiết sự kiện',
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="GroupDetailScreen"
          component={GroupDetailScreen}
          options={{
            headerShown: false,
            headerTitle: '',
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: '#fff',
          }}
        />

        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: true,
            headerTitle: 'Thông tin cá nhân',
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
          name="addUser"
          component={AddUserScreen}
          options={{
            headerShown: true,
            headerTitle: 'Thêm người dùng mới',
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
          name="EditUserScreen"
          component={EditUserScreen}
          options={{
            headerShown: true,
            headerTitle: 'Chỉnh sửa thông tin người dùng',
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
          name="EventDetails"
          component={EventDetails}
          options={{
            headerShown: false,
            headerTitle: 'Tìm kiếm',
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
          name="CreateGiftScreen"
          component={CreateGiftScreen}
          options={{
            headerShown: true,
            headerTitle: 'Tạo quà đổi thưởng',
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: 'black',
          }}
        />

<Stack.Screen
          name="HistoryScreen"
          component={HistoryScreen}
          options={{
            headerShown: true,
            headerTitle: 'Lịch sử đổi điểm',
            useNativeDriver: true,
            gestureEnabled: true,
            cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
            headerStyle: {
              backgroundColor: '#4c8d6e',
            },
            headerTintColor: 'black',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MainNavigator;
