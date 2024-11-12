import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth

import {colors, sizes} from '../../../constants/theme';
import {Dropdown} from 'react-native-element-dropdown'; 

const AddUserScreen = ({navigation}) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setphoneNumber] = useState('');
  const [selectedAddress, setselectedAddress] = useState('');
  const [password, setPassword] = useState(''); 
  const [role, setRole] = useState('user'); 

  const roles = [
    {label: 'User', value: 'user'},
    {label: 'Admin', value: 'admin'},
    {label: 'Partner', value: 'partner'},
  ];

  const handleSave = async () => {
    if (fullName && email && phoneNumber && selectedAddress && password) {
      try {
        // Đăng ký người dùng với Firebase Authentication
        await auth()
          .createUserWithEmailAndPassword(email, password)
          .then(async (userCredential) => {
            const user = userCredential.user;

            // Lưu thông tin người dùng vào Firestore
            await firestore().collection('users').doc(user.email).set({
              fullName,
              email,
              phoneNumber,
              selectedAddress,
              role,
              uid: user.email, // Lưu UID của người dùng từ Firebase Authentication
            });

            // Điều hướng trở lại màn hình trước sau khi lưu thành công
            navigation.goBack(); 
          });
      } catch (error) {
        console.error('Error adding user: ', error);
        if (error.code === 'auth/email-already-in-use') {
          Alert.alert('Email đã được sử dụng', 'Vui lòng chọn email khác.');
        } else if (error.code === 'auth/weak-password') {
          Alert.alert('Mật khẩu yếu', 'Mật khẩu phải có ít nhất 6 ký tự.');
        } else {
          Alert.alert('Đã có lỗi xảy ra', 'Vui lòng thử lại sau.');
        }
      }
    } else {
      alert('Vui lòng điền đầy đủ thông tin!');
    }
  };

  return (
    <View style={styles.container}>
      {/* Họ và tên */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập họ và tên"
          value={fullName}
          onChangeText={setFullName}
        />
      </View>

      {/* Email */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="nguyễn Văn A"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      {/* Mật khẩu */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Mật khẩu</Text>
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
      </View>

      {/* Số điện thoại */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          placeholder="0123456789"
          value={phoneNumber}
          onChangeText={setphoneNumber}
          keyboardType="phoneNumber-pad"
        />
      </View>

      {/* Địa chỉ */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Địa chỉ</Text>
        <TextInput
          style={styles.input}
          placeholder="123 Đường ABC, Quận XYZ, TP.HCM"
          value={selectedAddress}
          onChangeText={setselectedAddress}
        />
      </View>

      {/* Vai trò */}
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Vai trò</Text>
        <Dropdown
          style={styles.dropdown}
          data={roles}
          labelField="label"
          valueField="value"
          value={role}
          onChange={item => setRole(item.value)}
          placeholder="Chọn vai trò"
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Thêm người dùng mới</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: sizes.h3,
    color: colors.primary,
    marginBottom: 5,
    fontWeight:'bold',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
  },
  dropdown: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
  },
  saveButton: {
    backgroundColor: colors.green,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontSize: sizes.h3,
    fontWeight: 'bold',
  },
});

export default AddUserScreen;
