import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {colors, sizes} from '../../constants/theme';

const CustomDrawerContent = ({navigation, state}) => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const user = auth().currentUser;

      if (user) {
        try {
          const userRef = firestore()
            .collection('users')
            .where('email', '==', user.email);
          const snapshot = await userRef.get();

          if (!snapshot.empty) {
            const userData = snapshot.docs[0].data();
            setUserInfo(userData);
          } else {
            setError('User document does not exist!');
          }
        } catch (error) {
          setError(error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('User not authenticated!');
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.navigate('Login');
      })
      .catch(error => {
        console.log(error);
      });
  };

  if (loading) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{flex: 1}}>
        <Text>{error}</Text>
      </SafeAreaView>
    );
  }

  const getDrawerItemStyle = routeName => {
    return state?.index ===
      state?.routes.findIndex(route => route.name === routeName)
      ? {backgroundColor: colors.lightGray, padding: 16}
      : {padding: 16};
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.userInfoContainer}>
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri:
                userInfo.avatarUrl ||
                'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg',
            }} // Đặt link avatar mặc định nếu không có avatar
            style={styles.avatar}
          />
        </View>
        <Text style={styles.userInfoTitle}>Thông tin người dùng</Text>
        <Text style={styles.userInfoText}>Email: {userInfo.email}</Text>
        <Text style={styles.userInfoText}>Username: {userInfo.fullName}</Text>
      </View>

      <View style={styles.drawerItemsContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('HomeAdmin')}
          style={getDrawerItemStyle('HomeAdmin')}>
          <Text style={styles.drawerItem}>Trang chủ Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CategoryManagementScreen')}
          style={getDrawerItemStyle('CategoryManagementScreen')}>
          <Text style={styles.drawerItem}>Quản lý sự kiện</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('TaskScreen')}
          style={getDrawerItemStyle('TaskScreen')}>
          <Text style={styles.drawerItem}>Quản lý nhiệm vụ</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('GroupManagementScreen')}
          style={getDrawerItemStyle('GroupManagementScreen')}>
          <Text style={styles.drawerItem}>Quản lý hội nhóm</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('GiftManage')}
          style={getDrawerItemStyle('GiftManage')}>
          <Text style={styles.drawerItem}>Quản lý phần thưởng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate('UsersManage')}
          style={getDrawerItemStyle('UsersManage')}>
          <Text style={styles.drawerItem}>Quản lý người dùng</Text>
        </TouchableOpacity>
      

      </View>

      <View style={styles.logoutContainer}>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  userInfoContainer: {
    padding: 16,
    backgroundColor: colors.green,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    alignItems: 'center',
  },
  avatarContainer: {
    marginBottom: 10,
    borderRadius: 50,
    overflow: 'hidden',
    marginTop: 50,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  userInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  userInfoText: {
    fontSize: 16,
    color: '#fff',
  },
  drawerItemsContainer: {
    flex: 1,
  },
  drawerItem: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    color: colors.primary,
  },
  logoutContainer: {
    marginTop: 'auto',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
  },
  logoutText: {
    fontSize: 18,
    color: 'red',
  },
});

export default CustomDrawerContent;
