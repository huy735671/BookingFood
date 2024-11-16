import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Image
} from 'react-native';
import React, { useState } from 'react';
import { colors, sizes } from '../../constants/theme';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import Icon from '../Icon';
import FooterLogin from './FooterLogin';
import { firebase } from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


const WINDOW_WIDTH = Dimensions.get('window').width;

const Login = () => {
  const [email, setEmail] = useState('huycustomer@gmail.com');
  const [password, setPassword] = useState('123456Huy');
  const [errorMessage, setErrorMessage] = useState('');
  const [pwdHidden, setPwdHidden] = useState(true);
  const navigation = useNavigation();


  const handleLogin = async () => {
    try {
      const userCredential = await firebase.auth().signInWithEmailAndPassword(email, password);
      const user = userCredential.user;
  
      const userSnapshot = await firestore()
        .collection('users')
        .where('email', '==', user.email)
        .get();
  
      if (!userSnapshot.empty) {
        const userData = userSnapshot.docs[0].data();
        const role = userData.role;
  
        if (role === 'admin') {
          navigation.navigate('Admin');
        } else if (role === 'user') {
          navigation.navigate('Root');
        } else if (role === 'partner') {
          navigation.navigate('Partner');
        } else {
          setErrorMessage('Không tìm thấy vai trò phù hợp.');
        }
      } else {
        setErrorMessage('Không tìm thấy người dùng trong Firestore.');
      }
    } catch (error) {
      setErrorMessage('Thông tin đăng nhập không hợp lệ');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <SafeAreaView >
       <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon icon="Back" size={40} color="white" style={styles.icon} />
          </TouchableOpacity>
        </View>
        <View style={styles.imageBox}>

        <Image
              source={require('../../../assets/images/LoginIcon.png')}
              style={styles.img}
            />
            </View>
      <View style={styles.loginContainer}>
          <View style={{marginBottom: 20}} />
          <Text style={styles.label}>Email:</Text>
          <View style={styles.bodyContainer}>
            <Icon icon="Email" size={30} style={styles.LoginIcon} />
            <TextInput
              placeholder="Email tài khoản"
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
              placeholder="Mật khẩu"
              autoCapitalize="none"
              style={styles.textInput}
              secureTextEntry={pwdHidden}
              onChangeText={setPassword}
              value={password}
            />
            <TouchableOpacity
              style={{
                height: '100%',
                aspectRatio: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}
              onPress={() => setPwdHidden(!pwdHidden)}>
              <Ionicons
                name={pwdHidden ? 'eye-off-outline' : 'eye-outline'}
                size={24}
                style={{width: 24, height: 24, color: 'gray'}}
              />
            </TouchableOpacity>
          </View>
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}

          <View style={styles.forgetPassContainer}>
            <TouchableOpacity
              style={{position: 'absolute', right: 0}}
              onPress={() => navigation.navigate('ResetPw')}>
              <Text style={styles.forgetPassText}>Quên mật khẩu ?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={handleLogin} style={styles.buttonLogin}>
            <Text style={styles.buttonLoginText}>Đăng nhập</Text>
          </TouchableOpacity>
          <View style={{marginTop: 50}} />
          <FooterLogin />
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
    backgroundColor: '#7b70f9',
  },
  headerContainer: {
    marginLeft: 10,
    padding: 10,
    marginTop:50,
  },
  icon: {
    backgroundColor: colors.green,
    borderTopRightRadius: 20,
    borderBottomLeftRadius: 20,
  },
  imageBox: {
    alignItems: 'center',
  },
  img: {
    width: 250,
    height: 250,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#fff',
    marginBottom: 20,
  },
  loginContainer: {
    height: '100%',
    backgroundColor: colors.light,
    borderTopRightRadius: 50,
    borderTopLeftRadius: 50,
  },
  bodyContainer: {
    width: WINDOW_WIDTH - 60,
    height: 45,
    marginLeft: 30,
    marginTop: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
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
  forgetPassContainer: {
    width: WINDOW_WIDTH - 60,
    marginLeft: 30,
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
    borderRadius: 100,
  },
  buttonLoginText: {
    fontSize: sizes.h2,
    fontWeight: '600',
    color: colors.light,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginTop: 10,
  },
});
