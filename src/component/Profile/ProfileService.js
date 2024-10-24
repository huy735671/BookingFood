import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';

const ProfileService = () => {
  const navigation = useNavigation();
  const handlerProfile = () => {
    navigation.navigate('Profile');
  };

  return (
    <View style={styles.serviceContainer}>
      <TouchableOpacity onPress={handlerProfile}>
        <View style={styles.footerContainer}>
          <Icons
            name={'edit'}
            size={24}
            color={'#808080'}
            style={styles.InputIcon}
          />
          <Text style={styles.footerText}>Quản lý tài khoản</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity>
        <View style={styles.footerContainer}>
          <Icons
            name={'settings'}
            size={24}
            color={'#808080'}
            style={styles.InputIcon}
          />
          <Text style={styles.footerText}>Cài đặt</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity>
        <View style={styles.footerContainer}>
          <Icons
            name={'help'}
            size={24}
            color={'#808080'}
            style={styles.InputIcon}
          />

          <Text style={styles.footerText}>Hỗ trợ và trợ giúp</Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity>
        <View style={styles.footerContainer}>
          <Icons
            name={'logout'}
            size={24}
            color={'#808080'}
            style={styles.InputIcon}
          />
          <Text style={styles.footerText}>Đăng xuất</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  serviceContainer: {},
  footerContainer: {
    paddingLeft: 10,
    height: 50,
    width: '100%',
    flexDirection: 'row',
    marginTop: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e3e3e3',
  },
  footerText: {
    fontSize: 18,
    fontWeight: '500',
    color: 'black',
    marginLeft: 20,
  },
  InputIcon: {
    marginLeft: 12,
    marginRight: 5,
  },
});

export default ProfileService;
