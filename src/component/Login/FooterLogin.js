import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {sizes} from '../../constants/theme';

const FooterLogin = () => {
  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View style={styles.crossbar} />
        <Text> Hoặc đăng nhập với </Text>
        <View style={styles.crossbar} />
      </View>
      <View style={styles.footerContainer}>
        <TouchableOpacity>
          <Image
            source={require('../../../assets/images/Login/facebook.png')}
            resizeMode="contain"
            style={styles.socicalLogin}
          />
        </TouchableOpacity>
        <TouchableOpacity>
        <Image
          source={require('../../../assets/images/Login/google.png')}
          resizeMode="contain"
          style={styles.socicalLogin}
        />
        </TouchableOpacity>
        <TouchableOpacity>
        <Image
          source={require('../../../assets/images/Login/twitter.png')}
          resizeMode="contain"
          style={styles.socicalLogin}
        />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default FooterLogin;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    // width: WINDOW_WIDTH - 60,
    marginLeft: 30,
  },
  crossbar: {
    height: 1,
    width: '30%',
    backgroundColor: '#707070',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 30,
    // width: WINDOW_WIDTH - 60,
    marginLeft: 30,
    marginTop: 10,
  },
  socicalLogin: {
    width: 50,
    height: 40,
    borderRadius: sizes.radius,
    marginLeft: 20,
  },
});
