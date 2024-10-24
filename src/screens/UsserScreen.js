import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {colors, sizes} from '../constants/theme';
import ProfileService from '../component/Profile/ProfileService';

const UsserScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor='#4c8d6e'
      />
      <View style={styles.imgBox}>
        <Image
          source={require('../../assets/images/users/32.jpeg')}
          style={styles.imgContainer}
        />
        <Text style={styles.titleUser}>Jesica</Text>
        <Text style={styles.emailUser}>jesica@gmail.com</Text>
      </View>
      <View>
        <ProfileService />
      </View>
    </SafeAreaView>
  );
};

export default UsserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgBox: {
    height: 300,
    marginTop: 40,
    justifyContent: 'center',
    backgroundColor: colors.green,
    alignItems: 'center',
  },
  imgContainer: {
    borderRadius: 80,
  },
  titleUser: {
    marginTop: 20,
    fontWeight: 'bold',
    fontSize: sizes.title,
    color: colors.primary,
  },
  emailUser: {
    color: colors.black,
    fontSize: sizes.h3,
  },
  bodyContaier: {
    borderWidth: 1,
  },
});
