import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {colors} from '../constants/theme';
import HomePartner from '../Partner/src/screens/HomePartner';
import Icon from '../component/Icon';
import OrderScreen from '../Partner/src/screens/OrderScreen';
import Menu from '../Partner/src/screens/Menu';
import Setting from '../Partner/src/screens/Setting';

const Tab = createBottomTabNavigator();

const PartnerTabNavigator = () => {
  return (
    <Tab.Navigator
      initialRouteName="HomePartner"
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.gray,
        tabBarIcon: ({focused, color, size}) => {
          let iconName;
          if (route.name === 'HomePartner') {
            iconName = 'Home';
          } else if (route.name === 'Orders') {
            iconName = 'Bag';
          } else if (route.name === 'Menu') {
            iconName = 'list';
          } else if (route.name === 'Setting'){
            iconName = 'settings';
          }
          return (
            <Icon
              icon={iconName}
              size={size || 24}
              style={{tintColor: color}}
            />
          );
        },
      })}>
      <Tab.Screen
        name="HomePartner"
        component={HomePartner}
        options={{
          tabBarLabel: 'Trang chủ',
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Orders"
        component={OrderScreen}
        options={{tabBarLabel: 'Đơn hàng'}}
      />
      <Tab.Screen
        name="Menu"
        component={Menu}
        options={{tabBarLabel: 'Thực đơn'}}
      />
        <Tab.Screen
        name="Setting"
        component={Setting}
        options={{tabBarLabel: 'Cài đặt'}}
      />
    </Tab.Navigator>
  );
};

export default PartnerTabNavigator;
