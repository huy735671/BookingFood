import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, sizes} from '../../constants/theme';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const ProfileService = () => {
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
  });
  const [isTwoFactorEnabled, setIsTwoFactorEnabled] = useState(false);
  const [isEmailNotificationEnabled, setIsEmailNotificationEnabled] = useState(false);
  const [isPushNotificationEnabled, setIsPushNotificationEnabled] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        try {
          const userDoc = await firestore().collection('users').doc(currentUser.email).get();
          if (userDoc.exists) {
            setUserInfo(userDoc.data());
          } else {
            console.log('User data not found');
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      }
    };

    fetchUserData();
  }, []);

  const toggleTwoFactor = () => setIsTwoFactorEnabled(prevState => !prevState);
  const toggleEmailNotification = () => setIsEmailNotificationEnabled(prevState => !prevState);
  const togglePushNotification = () => setIsPushNotificationEnabled(prevState => !prevState);

  const handleDeleteAccount = () => {};
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: 280 }}>
      <View style={styles.serviceContainer}>
        <View style={styles.userInfoContainer}>
          <Text>Họ và tên</Text>
          <TextInput
            style={styles.userInfoInput}
            value={userInfo.fullName}
            editable={false}
            selectTextOnFocus={false}
          />
          <Text>Email</Text>
          <TextInput
            style={styles.userInfoInput}
            value={userInfo.email}
            editable={false}
            selectTextOnFocus={false}
          />
          <Text>Số điện thoại</Text>
          <TextInput
            style={styles.userInfoInput}
            value={userInfo.phoneNumber}
            editable={false}
            selectTextOnFocus={false}
          />
          <TouchableOpacity
            style={styles.editProfileButton}
            onPress={() => navigation.navigate('Profile', {userInfo})}>
            <Text style={styles.editProfileText}>Chỉnh sửa hồ sơ</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Bảo mật</Text>
        <View style={styles.passwordChangeContainer}>
          <Text style={styles.passwordChangeText}>Thay đổi mật khẩu</Text>
          <TouchableOpacity style={styles.changePasswordButton}>
            <Text style={styles.changePasswordButtonText}>Thay đổi</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.securityContainer}>
          <View style={styles.securityOption}>
            <Text style={styles.securityText}>Xác thực hai yếu tố</Text>
            <Switch
              value={isTwoFactorEnabled}
              onValueChange={toggleTwoFactor}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Thông báo</Text>
        <View style={styles.notificationContainer}>
          <View style={styles.notificationOption}>
            <Text style={styles.notificationText}>Thông báo qua email</Text>
            <Switch
              value={isEmailNotificationEnabled}
              onValueChange={toggleEmailNotification}
            />
          </View>
          <View style={styles.notificationOption}>
            <Text style={styles.notificationText}>Thông báo đẩy</Text>
            <Switch
              value={isPushNotificationEnabled}
              onValueChange={togglePushNotification}
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Cài đặt khác</Text>
        <View style={styles.languageContainer}>
          <Text style={styles.languageText}>Ngôn ngữ</Text>
          <TouchableOpacity style={styles.languageButton}>
            <Text style={styles.languageButtonText}>Tiếng Việt</Text>
            <Icon name="chevron-right" size={16} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.deleteAccountContainer}>
          <Text style={styles.deleteAccountText}>Xóa tài khoản</Text>
          <TouchableOpacity
            style={styles.deleteAccountButton}
            onPress={handleDeleteAccount}>
            <Icon name="trash" size={20} color={'red'} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.logoutButtonText}>Đăng xuất</Text>
          <Icon name="sign-out" size={20} color={'red'} />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  serviceContainer: {
    padding: 20,
  },
  userInfoContainer: {
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  userInfoInput: {
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#e3e3e3',
    marginVertical: 5,
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
    color: colors.primary,
  },
  editProfileButton: {
    marginTop: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 16,
    borderRadius: 5,
    alignItems: 'center',
  },
  editProfileText: {
    color: colors.primary,
    fontSize: sizes.body,
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    marginTop: 20,
    color: colors.primary,
  },
  passwordChangeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  passwordChangeText: {
    fontSize: 16,
    color: colors.primary,
  },
  changePasswordButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  changePasswordButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  securityContainer: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    paddingBottom: 10,
  },
  securityOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  securityText: {
    fontSize: 16,
    color: colors.primary,
  },
  notificationContainer: {
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
    paddingBottom: 10,
  },
  notificationOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  notificationText: {
    fontSize: 16,
    color: colors.primary,
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  languageText: {
    fontSize: 16,
    color: colors.primary,
  },
  languageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderWidth: 1,
    paddingHorizontal: 5,
    borderRadius: 5,
    borderColor: '#ddd',
  },
  languageButtonText: {
    fontSize: 16,
    marginRight: 5,
    color: colors.primary,
    fontWeight: 'bold',
  },
  deleteAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 5,
    marginBottom: 10,
  },
  deleteAccountText: {
    color: 'red',
    fontSize: 16,
  },
  deleteAccountButton: {
    padding: 5,
  },
  logoutButton: {
    marginTop: 10,
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
    borderRadius: 5,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  logoutButtonText: {
    color: 'red',
    fontSize: 16,
    marginLeft: 10,
    fontWeight: 'bold',
  },
});

export default ProfileService;
