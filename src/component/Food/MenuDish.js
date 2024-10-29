import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {colors, sizes} from '../../constants/theme';
import {useNavigation} from '@react-navigation/native';
import Tab from '../Tab';
import FavoriteButton from '../FavoriteButton';

const MenuDish = ({route}) => {
  const {selectedDish} = route.params || {};
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('1');

  const handlePress = dish => {
    navigation.navigate('DishDetail', {dish});
  };

  const dishes = [
    {
      id: '1',
      name: 'Món 1',
      price: '50.000đ',
      image: 'https://example.com/image1.jpg',
      categoryId: '1',
    },
    {
      id: '2',
      name: 'Món 2',
      price: '70.000đ',
      image: 'https://example.com/image2.jpg',
      categoryId: '1',
    },
    {
      id: '3',
      name: 'Món 3',
      price: '30.000đ',
      image: 'https://example.com/image3.jpg',
      categoryId: '2',
    },
    {
      id: '4',
      name: 'Món 4',
      price: '90.000đ',
      image: 'https://example.com/image4.jpg',
      categoryId: '2',
    },
    {
      id: '5',
      name: 'Món 5',
      price: '40.000đ',
      image: 'https://example.com/image5.jpg',
      categoryId: '3',
    },
    {
      id: '6',
      name: 'Món 6',
      price: '80.000đ',
      image: 'https://example.com/image6.jpg',
      categoryId: '3',
    },
  ];

  const limitCharacters = (text, maxChars) => {
    return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
  };
  const filteredDishes = dishes.filter(dish => dish.categoryId === activeTab);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="rgba(0,0,0,0)"
      />

      <View>
        <Image
          source={require('../../../assets/images/Restaurant.jpg')}
          style={styles.imgHeader}
        />
        <TouchableOpacity style={styles.favoriteButton}>
          <FavoriteButton />
        </TouchableOpacity>
      </View>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}>
          <Icon name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.restaurantName}>
          {limitCharacters(selectedDish.store, 21)}
        </Text>

        <TouchableOpacity style={styles.searchIcon}>
          <Icon name="search" size={24} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.dishItem}
        onPress={() => handlePress(selectedDish)}>
        <Image source={{uri: selectedDish.image}} style={styles.dishImage} />
        <View style={styles.dishDetails}>
          <Text style={styles.dishName}>{selectedDish.name}</Text>
          <Text style={styles.dishPrice}>{selectedDish.price}</Text>
        </View>
        <TouchableOpacity style={styles.cartIcon}>
          <Icon name="plus" size={20} color="black" />
        </TouchableOpacity>
      </TouchableOpacity>

      <Text style={styles.titleText}>Các món khác</Text>

      <View style={styles.tabContainer}>
        <Tab
          title="Danh mục 1"
          isActive={activeTab === '1'}
          onPress={() => setActiveTab('1')}
        />
        <Tab
          title="Danh mục 2"
          isActive={activeTab === '2'}
          onPress={() => setActiveTab('2')}
        />
        <Tab
          title="Danh mục 3"
          isActive={activeTab === '3'}
          onPress={() => setActiveTab('3')}
        />
      </View>

      <ScrollView>
        {filteredDishes.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.dishItem}
            onPress={() => handlePress(item)}>
            <Image source={{uri: item.image}} style={styles.dishImage} />
            <View style={styles.dishDetails}>
              <Text style={styles.dishName}>{item.name}</Text>
              <Text style={styles.dishPrice}>{item.price}</Text>
            </View>
            <TouchableOpacity style={styles.cartIcon}>
              <Icon name="plus" size={20} color="black" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 0,
  },
  imgHeader: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
    marginBottom: 20,
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    bottom: 30,
    right: 10,

    borderRadius: 20,
    padding: 5,
  },
  header: {
    position: 'absolute',
    top: 40,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 10,
    position: 'absolute',
    zIndex: 1,
  },
  restaurantName: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.primary,
    flex: 1,
    textAlign: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: sizes.radius,
  },
  searchIcon: {
    padding: 10,
    position: 'absolute',
    right: 10,
  },
  titleText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: sizes.title,
    padding: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: 'grey',
    marginBottom: 10,
  },
  dishItem: {
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dishImage: {
    width: 50,
    height: 50,
    borderRadius: 10,
    marginRight: 10,
  },
  dishDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  dishPrice: {
    fontSize: 16,
    color: colors.gray,
  },
  cartIcon: {
    marginLeft: 10,
  },
});

export default MenuDish;
