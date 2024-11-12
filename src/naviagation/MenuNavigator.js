import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeAdmin from '../Admin/screens/HomeAdmin';
import CustomDrawerContent from '../Admin/component/CustomDrawerContent';
import UsersManage from '../Admin/screens/UsersManage';
import CategoryManagementScreen from '../Admin/component/Manage/Home/CategoryManagementScreen';

const Drawer = createDrawerNavigator();

const MenuNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="HomeAdmin"
      drawerContent={props => <CustomDrawerContent {...props} />}>
      <Drawer.Screen
        name="HomeAdmin"
        component={HomeAdmin}
        options={{title: 'Trang chủ Admin'}}
      />

      <Drawer.Screen
        name="UsersManage"
        component={UsersManage}
        options={{title: 'Quản lý người dùng'}}
      />
      <Drawer.Screen
        name="CategoryManagementScreen"
        component={CategoryManagementScreen}
        options={{title: 'Quản lý danh mục'}}
      />
    </Drawer.Navigator>
  );
};

export default MenuNavigator;
