import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import HomeAdmin from '../Admin/screens/HomeAdmin';
import CustomDrawerContent from '../Admin/component/CustomDrawerContent';
import UsersManage from '../Admin/screens/UsersManage';
import CategoryManagementScreen from '../Admin/component/Manage/Home/CategoryManagementScreen';
import TaskScreen from '../Admin/screens/TaskScreen';
import GroupManagementScreen from '../Admin/screens/GroupManagementScreen';
import GroupDetailScreen from '../Admin/screens/GroupDetailScreen';
import GiftManage from '../Admin/component/Manage/GiftManage/GiftManage';

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
        options={{title: 'Quản lý sự kiện'}}
      />
      <Drawer.Screen
        name="TaskScreen"
        component={TaskScreen}
        options={{title: 'Quản lý nhiệm vụ'}}
      />

<Drawer.Screen
        name="GroupManagementScreen"
        component={GroupManagementScreen}
        options={{title: 'Quản lý hội nhóm'}}
      />

<Drawer.Screen
        name="GroupDetailScreen"
        component={GroupDetailScreen}
        options={{title: 'Quản lý hội nhóm'}}
      />

<Drawer.Screen
        name="GiftManage"
        component={GiftManage}
        options={{title: 'Quản lý hội nhóm'}}
      />
    </Drawer.Navigator>
  );
};

export default MenuNavigator;
