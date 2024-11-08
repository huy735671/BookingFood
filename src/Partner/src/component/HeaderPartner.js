import React from 'react';
import { StyleSheet, Text, View, Image, SafeAreaView, TouchableOpacity } from 'react-native';
import Icon from '../../../component/Icon';

const HeaderPartner = () => {
  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Quản lý cửa hàng</Text>
      <TouchableOpacity>
      <Icon icon='Notification' size={30} style={styles.notificationIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderPartner;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop:50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  notificationIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});
