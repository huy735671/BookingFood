import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, ScrollView, StatusBar} from 'react-native';
import MainHeader from '../component/MainHeader';
import SearchBar from '../component/SearchBar';
import OptionsList from '../component/Home/OptionsList';
import SpecialOffer from '../component/Recommend/SpecialOffer';
import PopularDishes from '../component/Food/PopularDishes';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {sizes} from '../constants/theme';
import {useNavigation} from '@react-navigation/native';
import HistoryBottom from '../component/History/historyBottom';

const HomeScreen = () => {
  const [userLocation, setUserLocation] = useState('Chưa chọn địa chỉ');
  const [userAddresses, setUserAddresses] = useState([]);
  const [popularDishes, setPopularDishes] = useState([]);
  const navigation = useNavigation();
  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const dishesSnapshot = await firestore().collection('dishes').get();
        const dishesData = dishesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPopularDishes(dishesData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu món ăn:', error);
      }
    };

    fetchDishes();
  }, []);

  useEffect(() => {
    const fetchUserAddresses = async () => {
      const user = auth().currentUser;
      if (user) {
        try {
          const userDoc = await firestore()
            .collection('users')
            .doc(user.email)
            .get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setUserAddresses(userData?.addresses || []);
            setUserLocation(userData?.addresses?.[0] || 'Chưa chọn địa chỉ');
          }
        } catch (error) {
          console.error('Lỗi khi lấy địa chỉ của người dùng:', error);
        }
      }
    };

    fetchUserAddresses();
  }, []);

  const handleAddAddress = () => {
    console.log('Thêm địa chỉ mới');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="#fff" />
      <MainHeader
        userLocation={userLocation}
        addresses={userAddresses}
        onAddAddress={handleAddAddress}
      />
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <SearchBar />
        <OptionsList />
        <SpecialOffer />
        <Text style={styles.sectionTitle}>Món ăn phổ biến</Text>

        <PopularDishes dishes={popularDishes} />
      </ScrollView>
      <HistoryBottom onPress={() => navigation.navigate('HistoryOrders')} style={styles.historyButton} />
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    marginBottom: 15,
    marginTop: 15,
  },
  dishCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dishImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 10,
  },
  dishInfo: {
    flex: 1,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dishPrice: {
    fontSize: 16,
    color: '#888',
    marginTop: 5,
  },
  historyButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    zIndex:10,
  },
});
