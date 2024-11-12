import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { colors, sizes } from '../../../constants/theme';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from '../../../component/Icon';
import { Dropdown } from 'react-native-element-dropdown'; // Import Dropdown

const EditUserScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params; // Lấy thông tin người dùng từ props truyền vào

  const [fullName, setFullName] = useState(user.fullName);
  const [email, setEmail] = useState(user.email);
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber);
  const [selectedAddress, setSelectedAddress] = useState(user.selectedAddress);
  const [role, setRole] = useState(user.role);

  // Danh sách vai trò
  const roles = [
    { label: 'Admin', value: 'admin' },
    { label: 'Partner', value: 'partner' },
    { label: 'User', value: 'user' }
  ];

  // Hàm lưu thông tin đã chỉnh sửa
  const handleSave = () => {
    firestore()
      .collection('users')
      .doc(user.id)  // ID của người dùng để cập nhật
      .update({
        fullName,
        email,
        phoneNumber,
        selectedAddress,
        role,
      })
      .then(() => {
        Alert.alert('Thành công', 'Thông tin người dùng đã được cập nhật!');
        navigation.goBack();
      })
      .catch((error) => {
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật thông tin');
        console.error(error);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chỉnh sửa thông tin người dùng</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          value={fullName}
          onChangeText={setFullName}
          placeholder="Nhập họ và tên"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          editable={false} // Không cho phép chỉnh sửa email
          placeholder="Email"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Nhập số điện thoại"
          keyboardType="phone-pad"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Địa chỉ</Text>
        <TextInput
          style={styles.input}
          value={selectedAddress}
          onChangeText={setSelectedAddress}
          placeholder="Nhập địa chỉ"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Vai trò</Text>
        <Dropdown
          style={styles.input}
          data={roles}
          labelField="label"
          valueField="value"
          value={role}
          onChange={item => setRole(item.value)}
          placeholder="Chọn vai trò"
          containerStyle={styles.dropdown}
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Lưu</Text>
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
  header: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.primary,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  placeholderText: {
    color: '#bbb',
    fontSize: sizes.h3,
  },
  saveButton: {
    backgroundColor: colors.green,
    paddingVertical: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: sizes.h3,
  },
  dropdown: {
    marginTop: 10,
  },
});

export default EditUserScreen;
