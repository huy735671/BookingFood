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

const HomeScreen = () => {
  const [userLocation, setUserLocation] = useState('Chưa chọn địa chỉ');
  const [userAddresses, setUserAddresses] = useState([]);
  const [popularDishes, setPopularDishes] = useState([]);
  const navigation = useNavigation();
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsSnapshot = await firestore().collection('EVENTS').get();
        const eventsData = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPopularDishes(eventsData); 
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu sự kiện:', error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="#4c8d6e"
      />
      <MainHeader />

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        {/* <SearchBar /> */}
        <OptionsList />
        <SpecialOffer />
        <View>
          <Text style={styles.sectionTitle}>Sự kiện sắp tới</Text>
        </View>
        <PopularDishes dishes={popularDishes} />
      </ScrollView>
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
    zIndex: 10,
  },
});
