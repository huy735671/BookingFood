import {StatusBar, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import FooterLogin from '../component/Login/FooterLogin';
import LoginHeader from '../component/Login/LoginHeader';
import Login from '../component/Login/Login';
import SignUp from '../component/Login/SignUp';

const SIGN_IN = 'SIGN_IN';
const SIGN_UP = 'SIGN_UP';
const LoginScreen = () => {
  const [page, setPage] = useState('SIGN_IN');

  return (
    <View style={{width: '100%', height: '100%'}}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />
      <View style={{width: '100%', height: '25%'}}>
        <LoginHeader page={page} setPage={setPage}/>
      </View>
      <View style={{height: '60%', width: '100%', backgroundColor: '#eeeeee',}}>
        {page === SIGN_IN ? <Login /> : <SignUp/>}
      </View>
      <View style={{flex: 1}}>
        <FooterLogin />
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({});
