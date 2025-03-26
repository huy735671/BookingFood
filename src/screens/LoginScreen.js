import React from 'react';
import { View, StyleSheet, StatusBar, Text, Image, TouchableOpacity, ImageBackground } from 'react-native';
import { colors, sizes } from '../constants/theme';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ImageBackground source={require('../../assets/images/background.jpg')} style={styles.background}>
        <View style={styles.welcomeContainer}>

          {/* <Image source={require('../../assets/images/Logo.png')} style={styles.logo} /> */}
    <View style={styles.logo} />
          <Text style={styles.welcomeText}>Chào mừng đến với EcoWarriors</Text>

          <View>
            <Image source={require('../../assets/images/booking.png')} style={styles.image} />
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={() => navigation.navigate('SignUp')}>
            <Text style={styles.registerButtonText}>Đăng ký</Text>
          </TouchableOpacity>

          <View style={styles.loginContainer}>
            <Text style={styles.alreadyText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text style={styles.loginText}>Đăng nhập</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  background: {
    flex: 1,
    resizeMode: 'cover', 
  },
  welcomeContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 80, 
    height: 80,     
    alignSelf: 'flex-start',
    marginLeft: 20,
    marginTop: 40,
  },
  welcomeText: {
    fontWeight: 'bold',
    fontSize: sizes.title,
    alignSelf: 'flex-start', 
    marginLeft: 20,        
    marginTop: 10,     
    color: '#ffffff',      
  },
  image: {
    marginTop: 50,
    width: 350,
    height: 350,
  },
  registerButton: {
    backgroundColor: colors.green,
    paddingVertical: 15,
    width: '90%', 
    borderRadius: 8,
    marginTop: 50,
    alignItems: 'center',
  },
  registerButtonText: {
    color: '#fff',
    fontSize: sizes.h2,
    fontWeight: 'bold',
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  alreadyText: {
    color: '#ffffff',
    fontSize: sizes.h3,
  },
  loginText: {
    color: '#FFFF33', 
    fontSize: sizes.h3,
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
