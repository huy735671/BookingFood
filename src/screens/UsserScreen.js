import React, { useEffect, useState } from 'react';
import {
  Image,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { colors, sizes } from '../constants/theme';
import ProfileService from '../component/Profile/ProfileService';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const UsserScreen = () => {
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    avatarUrl: null,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        try {
          const userDoc = await firestore().collection('users').doc(currentUser.email).get();
          if (userDoc.exists) {
            setUserData(userDoc.data());
          } else {
            console.log('User data not found');
          }
        } catch (error) {
          console.error('Error fetching user data: ', error);
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor='#4c8d6e' />
      <View style={styles.imgBox}>
        <Image
          source={userData.avatarUrl ? { uri: userData.avatarUrl } : require('../../assets/images/users/35.jpeg')}
          style={styles.imgContainer}
        />
        <Text style={styles.titleUser}>{userData.fullName || 'Tên người dùng'}</Text>
        <Text style={styles.emailUser}>{userData.email || 'Email người dùng'}</Text>
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
    height: 250,
    marginTop: 40,
    justifyContent: 'center',
    backgroundColor: colors.green,
    alignItems: 'center',
  },
  imgContainer: {
    width: 120,
    height: 120,
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
