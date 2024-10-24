import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  StatusBar,
} from 'react-native';
import React from 'react';
import MainHeader from '../component/MainHeader';
import SearchBar from '../component/SearchBar';
import OptionsList from '../component/Home/OptionsList';
import SpecialOffer from '../component/Recommend/SpecialOffer';
import PopularDishes from '../component/Food/PopularDishes';

const HomeScreen = () => {
  
  const popularDishes = [
    {
      id: 1,
      name: 'Pizza Margherita',
      image: 'https://nz.ooni.com/cdn/shop/articles/20220211142645-margherita-9920.jpg?crop=center&height=800&v=1680290572&width=800',
      price: '150.000 VND',
      store: 'Pizza Store',
    },
    {
      id: 2,
      name: 'Sushi',
      image: 'https://sushiworld.com.vn/wp-content/uploads/2023/11/c.jpg',
      price: '200.000 VND',
      store: 'Sushi Shop',
    },
    {
      id: 3,
      name: 'Burger',
      image: 'https://www.foodandwine.com/thmb/DI29Houjc_ccAtFKly0BbVsusHc=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/crispy-comte-cheesburgers-FT-RECIPE0921-6166c6552b7148e8a8561f7765ddf20b.jpg',
      price: '120.000 VND',
      store: 'Burger Joint',
    },
   
  ];
  const userLocation = "Phú lợi, Tp. Thủ Dầu Một, Bình Dương";

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor='#fff'
      />
      <MainHeader userLocation={userLocation}/>
      {/* <ScreenHeader mainTitle="Bạn đói" secondTitle="Đã có chúng tôi" /> */}

      
      <ScrollView style={styles.scrollView}>
        <SearchBar  />
        <OptionsList/> 
        <SpecialOffer />

        <Text style={styles.sectionTitle}>Món ăn phổ biến</Text>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
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
});
