import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Switch,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import HeaderPartner from '../component/HeaderPartner';
import {colors} from '../../../constants/theme';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Setting = () => {
  const [userInfo, setUserInfo] = useState({
    fullName: '',
    email: '',
    phoneNumber: '',
    storeName: '', 
    storeAddress: '', 
    storeHours: '',
  });
  const [notificationsEmail, setNotificationsEmail] = useState(true);
  const [notificationsSMS, setNotificationsSMS] = useState(false);
  const [notificationsPush, setNotificationsPush] = useState(true);
  const navigation = useNavigation();
  // States for payment methods
  const [cashEnabled, setCashEnabled] = useState(true);
  const [cardEnabled, setCardEnabled] = useState(true);
  const [momoEnabled, setMomoEnabled] = useState(true);

  // Fetch user data from Firestore based on logged-in email
  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        try {
          const userSnapshot = await firestore()
            .collection('users')
            .doc(currentUser.email)
            .get();
          if (userSnapshot.exists) {
            setUserInfo(userSnapshot.data());
          }
        } catch (error) {
          console.log('Error fetching user data: ', error);
        }
      }
    };
    fetchUserData();
  }, []);

  const handleSaveSettings = async () => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      try {
        await firestore().collection('users').doc(currentUser.email).update({
          fullName: userInfo.fullName,
          phoneNumber: userInfo.phoneNumber,
          storeName: userInfo.storeName,
          storeAddress: userInfo.storeAddress,
          storeHours: userInfo.storeHours,
        });
        alert('Cài đặt cửa hàng đã được lưu!');
      } catch (error) {
        console.log('Error saving store settings: ', error);
        alert('Lỗi khi lưu cài đặt cửa hàng.');
      }
    }
  };

  const handleLogout = async () => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      try {
        await auth().signOut(); 
        navigation.replace('SignIn'); 
        console.log('Đăng xuất thành công')
      } catch (error) {
        console.log('Error logging out: ', error);
        alert('Có lỗi xảy ra khi đăng xuất. Vui lòng thử lại.');
      }
    } else {
      console.log('No user currently signed in.');
      alert('Không có người dùng nào đang đăng nhập.');
      navigation.replace('SignIn'); 
    }
  };

  return (
    <View style={styles.container}>
      <HeaderPartner />
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
          <TextInput
            style={styles.input}
            placeholder="Họ và tên"
            value={userInfo.fullName}
            onChangeText={text =>
              setUserInfo(prevState => ({...prevState, fullName: text}))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={userInfo.email}
            editable={false} 
          />
          <TextInput
            style={styles.input}
            placeholder="Số điện thoại"
            value={userInfo.phoneNumber}
            onChangeText={text =>
              setUserInfo(prevState => ({...prevState, phoneNumber: text}))
            }
          />
          <TouchableOpacity style={styles.button} onPress={handleSaveSettings}>
            <Text style={styles.buttonText}>Cập nhật thông tin</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt cửa hàng</Text>
          <TextInput
            style={styles.input}
            placeholder="Tên cửa hàng"
            value={userInfo.storeName}
            onChangeText={text =>
              setUserInfo(prevState => ({...prevState, storeName: text}))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Địa chỉ"
            value={userInfo.storeAddress}
            onChangeText={text =>
              setUserInfo(prevState => ({...prevState, storeAddress: text}))
            }
          />
          <TextInput
            style={styles.input}
            placeholder="8:00 - 22:00"
            value={userInfo.storeHours}
            onChangeText={text =>
              setUserInfo(prevState => ({...prevState, storeHours: text}))
            }
          />
          <TouchableOpacity style={styles.button} onPress={handleSaveSettings}>
            <Text style={styles.buttonText}>Lưu cài đặt</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt thanh toán</Text>
          <TextInput style={styles.input} placeholder="Tài khoản ngân hàng" />
          <TextInput style={styles.input} placeholder="Số tài khoản" />
          <TextInput style={styles.input} placeholder="Tên ngân hàng" />
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Chọn ngân hàng</Text>
          </TouchableOpacity>

          <View style={styles.paymentMethods}>
            <Text>Phương thức thanh toán được chấp nhận:</Text>
            <View style={styles.notificationRow}>
              <Text>• Tiền mặt</Text>
              <Switch value={cashEnabled} onValueChange={setCashEnabled} />
            </View>
            <View style={styles.notificationRow}>
              <Text>• Thẻ</Text>
              <Switch value={cardEnabled} onValueChange={setCardEnabled} />
            </View>
            <View style={styles.notificationRow}>
              <Text>• Ví MoMo</Text>
              <Switch value={momoEnabled} onValueChange={setMomoEnabled} />
            </View>
          </View>

          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Cập nhật cài đặt thanh toán</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Cài đặt thông báo</Text>
          <View style={styles.notificationRow}>
            <Text>Nhận thông báo qua email</Text>
            <Switch
              value={notificationsEmail}
              onValueChange={setNotificationsEmail}
            />
          </View>
          <View style={styles.notificationRow}>
            <Text>Nhận thông báo qua SMS</Text>
            <Switch
              value={notificationsSMS}
              onValueChange={setNotificationsSMS}
            />
          </View>
          <View style={styles.notificationRow}>
            <Text>Nhận thông báo đẩy</Text>
            <Switch
              value={notificationsPush}
              onValueChange={setNotificationsPush}
            />
          </View>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Lưu cài đặt thông báo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Trung tâm hỗ trợ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>Quản lý tài khoản</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Đăng xuất</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default Setting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContainer: {
    padding: 15,
  },
  section: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  paymentMethods: {
    marginTop: 10,
    marginBottom: 10,
  },
  notificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  link: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 5,
    borderRadius: 5,
  },
  linkText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  logoutButton: {
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: 'red',
  },
  logoutText: {
    color: colors.light,
    fontWeight: 'bold',
  },
});
