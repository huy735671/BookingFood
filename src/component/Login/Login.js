import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Dimensions
  } from 'react-native';
  import React, {useState} from 'react';
  import {colors, sizes} from '../../constants/theme';
  import Icons from 'react-native-vector-icons/MaterialIcons';
  import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
  
  const WINDOW_WIDTH = Dimensions.get('window').width;
  
  const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [pwdHidden, setPwdHidden] = useState(true);

    const navigation = useNavigation();

    return (
      <View style={styles.container}>
        <Text style={styles.titleHeader}>Đăng nhập.</Text>
  
        <View style={styles.bodyContainer}>
          <Icons name="email" size={30} style={styles.LoginIcon} />
          <TextInput
            placeholder="Nhập email"
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
  
        <View style={styles.forgetPassContainer}>
          <TouchableOpacity style={{position: 'absolute', right: 0}}>
            <Text style={styles.forgetPassText}>Quên mật ?</Text>
          </TouchableOpacity>
        </View>
  
        <TouchableOpacity style={styles.buttonLogin} onPress={()=>{navigation.navigate('Root')}}>
          <Text style={styles.buttonLoginText}>Đăng nhập</Text>
        </TouchableOpacity>
  
        <View></View>
      </View>
    );
  };
  
  export default Login;
  
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
      color: colors.white,
      fontSize: sizes.h3,
    },
  });
  