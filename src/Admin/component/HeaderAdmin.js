import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import Icon from '../../component/Icon';
import { useNavigation } from '@react-navigation/native';

const HeaderAdmin = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.headerContainer}>
      <Text style={styles.headerTitle}>Trang chủ Admin</Text>
      <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
        <Icon icon="Hamburger" size={30} />
      </TouchableOpacity>
    </View>
  );
};

export default HeaderAdmin;

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: 50,
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
});
