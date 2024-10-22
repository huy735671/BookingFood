import {
    Dimensions,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
  } from 'react-native';
  import React, {useState} from 'react';
  import {colors, sizes} from '../../constants/theme';
  import Icons from 'react-native-vector-icons/MaterialIcons';
  import Ionicons from 'react-native-vector-icons/Ionicons';
  import FontAwesome from 'react-native-vector-icons/FontAwesome';

  const WINDOW_WIDTH = Dimensions.get('window').width;

  const SignUp = () => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [pwdHidden, setPwdHidden] = useState(true);
  
    return (
      <View style={styles.container}>
        <Text style={styles.titleHeader}>Tạo tài khoản mới</Text>
  
        <View style={styles.bodyContainer}>
          <FontAwesome name="user" size={30} style={styles.LoginIcon} />
          <TextInput
            placeholder="Tên hiển thị"
            autoCapitalize="words"
            style={styles.textInput}
            onChangeText={setFullName}
            value={fullName}
          />
        </View>
  
        <View style={styles.bodyContainer}>
          <Icons name="email" size={30} style={styles.LoginIcon} />
          <TextInput
            placeholder="Email của bạn"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={setEmail}
            value={email}
          />
        </View>
  
        <View style={styles.bodyContainer}>
          <Ionicons name="lock-closed" size={30} style={styles.LoginIcon} />
          <TextInput
            placeholder="Mật khẩu"
            autoCapitalize="none"
            style={styles.textInput}
            secureTextEntry={pwdHidden}
            onChangeText={setPassword}
            value={password}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPwdHidden(!pwdHidden)}>
            <Ionicons
              name={pwdHidden ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              style={styles.eyeIconStyle}
            />
          </TouchableOpacity>
        </View>
  
        <View style={styles.bodyContainer}>
          <Ionicons name="lock-closed" size={30} style={styles.LoginIcon} />
          <TextInput
            placeholder="Nhập lại mật khẩu"
            autoCapitalize="none"
            style={styles.textInput}
            secureTextEntry={pwdHidden}
            onChangeText={setConfirmPassword}
            value={confirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPwdHidden(!pwdHidden)}>
            <Ionicons
              name={pwdHidden ? 'eye-off-outline' : 'eye-outline'}
              size={24}
              style={styles.eyeIconStyle}
            />
          </TouchableOpacity>
        </View>
  
        <View style={styles.bodyContainer}>
          <Ionicons name="phone-portrait" size={30} style={styles.LoginIcon} />
          <TextInput
            placeholder="Số điện thoại (+84)"
            autoCapitalize="none"
            style={styles.textInput}
            onChangeText={setPhone}
            value={phone}
            keyboardType="phone-pad"
          />
        </View>
  
       
  
        <TouchableOpacity style={styles.buttonLogin}>
          <Text style={styles.buttonLoginText}>Đăng ký</Text>
        </TouchableOpacity>
      </View>
    );
  };
  
  export default SignUp;
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
    },
    titleHeader: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'black',
      marginLeft: 30,
    },
    bodyContainer: {
      width: WINDOW_WIDTH - 60,
      height: 45,
      marginLeft: 30,
      marginTop: 20,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#FFFFFF',
      borderRadius: 10,
    },
    LoginIcon: {
      color: colors.gray,
      marginHorizontal: 10,
    },
    textInput: {
      height: '100%',
      flex: 1,
      fontSize: 16,
    },
    eyeIcon: {
      height: '100%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    eyeIconStyle: {
      width: 24,
      height: 24,
      color: 'gray',
    },

    buttonLogin: {
      height: 50,
      width: WINDOW_WIDTH - 60,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#4c8d6e',
      marginTop: 20,
      marginLeft: 30,
      borderRadius: 100,
    },
    buttonLoginText: {
      color: colors.white,
      fontSize: sizes.h3,
    },
  });
  