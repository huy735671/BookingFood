import {
  Dimensions,
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {colors, sizes} from '../../constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from '../Icon';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

const WINDOW_WIDTH = Dimensions.get('window').width;

const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pwdHidden, setPwdHidden] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const navigation = useNavigation();

  const handleSelectImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        setAvatar(response.assets[0].uri);
      }
    });
  };

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      alert('Mật khẩu không khớp.');
      return;
    }
  
    try {
      // Tạo người dùng với Firebase Authentication
      await auth().createUserWithEmailAndPassword(email, password);
  
      // Sử dụng email làm document ID
      const userRef = firestore().collection('users').doc(email);
  
      let avatarUrl = '';
      if (avatar) {
        // Tải ảnh lên Firebase Storage
        const storageRef = storage().ref(`avatars/${email}.jpg`);
        await storageRef.putFile(avatar);
        avatarUrl = await storageRef.getDownloadURL();
      }
  
      // Lưu dữ liệu người dùng vào Firestore
      await userRef.set({
        fullName,
        email,
        phoneNumber,
        role: 'user',
        avatarUrl: avatarUrl || '',
      });
  
      alert('Đăng ký thành công!');
      navigation.navigate('SignIn');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Email đã được sử dụng cho một tài khoản khác.');
      } else {
        console.error('Error signing up: ', error);
        alert('Đã xảy ra lỗi khi đăng ký.');
      }
    }
  };
  
  
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon icon="Back" size={40} color="#fff" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.imageBox}>
          <Image
            source={require('../../../assets/images/SingiupIcon.png')}
            style={styles.img}
          />
        </View>

        <View style={styles.signUpContainer}>
        <TouchableOpacity
            style={styles.avatarContainer}
            onPress={handleSelectImage}>
            {avatar ? (
              <Image source={{uri: avatar}} style={styles.avatar} />
            ) : (
              <Ionicons name="camera-outline" size={24} color="black" />
            )}
          </TouchableOpacity>
          <View style={{marginBottom: 20}} />

          <Text style={styles.label}>Tên của bạn:</Text>
          <View style={styles.bodyContainer}>
            <Icon icon="User" size={30} style={styles.LoginIcon} />
            <TextInput
              placeholder="Nguyễn Văn A"
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={setFullName}
              value={fullName}
            />
          </View>

          <Text style={styles.label}>Email:</Text>
          <View style={styles.bodyContainer}>
            <Icon icon="Email" size={30} style={styles.LoginIcon} />
            <TextInput
              placeholder="name@gmail.com"
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={setEmail}
              value={email}
            />
          </View>

          <Text style={styles.label}>Mật khẩu:</Text>
          <View style={styles.bodyContainer}>
            <Icon icon="Key" size={30} style={styles.LoginIcon} />
            <TextInput
              placeholder="********"
              autoCapitalize="none"
              style={styles.textInput}
              secureTextEntry={pwdHidden}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setPwdHidden(!pwdHidden)}>
              <Ionicons
                name={pwdHidden ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                style={{width: 24, height: 24, color: 'gray'}}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Nhập lại mật khẩu:</Text>
          <View style={styles.bodyContainer}>
            <Icon icon="Key" size={30} style={styles.LoginIcon} />
            <TextInput
              placeholder="********"
              autoCapitalize="none"
              style={styles.textInput}
              secureTextEntry={pwdHidden}
              onChangeText={setConfirmPassword}
              value={confirmPassword}
            />
            <TouchableOpacity
              style={styles.eyeIconContainer}
              onPress={() => setPwdHidden(!pwdHidden)}>
              <Ionicons
                name={pwdHidden ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                style={{width: 24, height: 24, color: 'gray'}}
              />
            </TouchableOpacity>
          </View>

          <Text style={styles.label}>Số điện thoại:</Text>
          <View style={styles.bodyContainer}>
            <Icon icon="Phone" size={30} style={styles.LoginIcon} />
            <TextInput
              placeholder="0326..."
              autoCapitalize="none"
              style={styles.textInput}
              onChangeText={setPhoneNumber}
              value={phoneNumber}
              keyboardType="phone-pad"
            />
          </View>

          <View style={styles.forgetPassContainer}>
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.forgetPassText}>Bạn đã có tài khoản?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.buttonLogin} onPress={handleSignUp}>
            <Text style={styles.buttonLoginText}>Đăng ký</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7b70f9',
  },
  headerContainer: {
    marginLeft: 10,
    padding: 10,
    marginTop: 50,
  },
  signUpContainer: {
    height: '100%',
    backgroundColor: colors.light,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
  icon: {
    backgroundColor: colors.green,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  imageBox: {
    alignItems: 'center',
    marginBottom: 20,
  },
  img: {
    width: 180,
    height: 150,
  },
  bodyContainer: {
    width: WINDOW_WIDTH - 40,
    height: 50,
    marginLeft: 20,
    marginTop: 10,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
  },
  label: {
    marginLeft: 30,
    marginTop: 10,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  LoginIcon: {
    color: colors.gray,
    resizeMode: 'stretch',
    marginHorizontal: 10,
  },
  textInput: {
    height: '100%',
    flex: 1,
    fontSize: 16,
  },
  eyeIconContainer: {
    height: '100%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  forgetPassContainer: {
    width: WINDOW_WIDTH - 60,
    marginLeft: 30,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  forgetPassText: {
    color: '#707070',
  },
  buttonLogin: {
    height: 50,
    width: WINDOW_WIDTH - 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#4c8d6e',
    marginTop: 20,
    marginLeft: 30,
    borderRadius: 10,
  },
  buttonLoginText: {
    color: colors.white,
    fontSize: sizes.h3,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: colors.green,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 10,
    top: 10,
    borderRadius: 50,
    zIndex: 1,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
});
