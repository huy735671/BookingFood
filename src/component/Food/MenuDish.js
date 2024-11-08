import React, { useState, useEffect } from 'react';
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
import { colors, sizes } from '../../constants/theme';
import { useNavigation } from '@react-navigation/native';
import FavoriteButton from '../FavoriteButton';
import firestore from '@react-native-firebase/firestore';

const MenuDish = ({ route }) => {
  const { selectedDish } = route.params || {};
  const [otherDishes, setOtherDishes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    if (selectedDish?.ownerEmail) {
      const fetchOtherDishes = async () => {
        try {
          const snapshot = await firestore()
            .collection('dishes')
            .where('ownerEmail', '==', selectedDish.ownerEmail)
            .get();
  
          const dishesList = snapshot.docs.map(doc => doc.data());
          
          const filteredDishes = dishesList.filter(dish => dish.dishName !== selectedDish.dishName);
          setOtherDishes(filteredDishes);
        } catch (error) {
          console.error('Error fetching dishes: ', error);
        }
      };
  
      fetchOtherDishes();
    }
  }, [selectedDish]);
  

  const handlePress = (dish) => {
    navigation.navigate('DishDetail', { dish });
  };

  const limitCharacters = (text, maxChars) => {
    return text.length > maxChars ? text.slice(0, maxChars) + '...' : text;
  };

  const formatPrice = (price) => {
    if (!price) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

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
        <Image source={{ uri: selectedDish.image }} style={styles.dishImage} />
        <View style={styles.dishDetails}>
          <Text style={styles.dishName}>{selectedDish.dishName}</Text>
          <Text style={styles.dishPrice}>{formatPrice(selectedDish.price)}</Text>
        </View>
        <TouchableOpacity style={styles.cartIcon}>
          <Icon name="plus" size={20} color="black" />
        </TouchableOpacity>
      </TouchableOpacity>

      <Text style={styles.titleText}>Các món khác</Text>

      <ScrollView style={styles.otherDishesList}>
        {otherDishes.map((dish, index) => (
          <TouchableOpacity
            key={index}
            style={styles.dishItem}
            onPress={() => handlePress(dish)}>
            <Image source={{ uri: dish.image }} style={styles.dishImage} />
            <View style={styles.dishDetails}>
              <Text style={styles.dishName}>{dish.dishName}</Text>
              <Text style={styles.dishPrice}>{formatPrice(dish.price)}</Text>
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
    borderRadius: 10,
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
  otherDishesList: {
    marginTop: 20,
  },
});

export default MenuDish;
