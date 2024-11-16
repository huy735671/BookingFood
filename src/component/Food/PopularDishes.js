import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import firestore from '@react-native-firebase/firestore';

const PopularDishes = ({dishes}) => {
  const [dishesWithStore, setDishesWithStore] = useState([]);
  const [pressedIndex, setPressedIndex] = useState(null);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchStoreNames = async () => {
      try {
        const updatedDishes = await Promise.all(
          dishes.map(async dish => {
            const userDoc = await firestore()
              .collection('users')
              .doc(dish.ownerEmail)
              .get();
            const storeName =
              userDoc.exists && userDoc.data().storeName
                ? userDoc.data().storeName
                : 'Đang cập nhật';
            return {...dish, store: storeName};
          }),
        );
        setDishesWithStore(updatedDishes);
      } catch (error) {
        console.error('Error fetching store names:', error);
      }
    };

    fetchStoreNames();
  }, [dishes]);

  const handlePress = dish => {
    navigation.navigate('MenuDish', {selectedDish: dish});
  };

  const formatPrice = price => {
    if (!price) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <View style={styles.container}>
      {dishesWithStore.map((dish, index) => (
        <TouchableOpacity
          key={dish.id}
          style={[
            styles.dishCard,
            pressedIndex === index && styles.pressedCard,
          ]}
          onPressIn={() => setPressedIndex(index)}
          onPressOut={() => setPressedIndex(null)}
          onPress={() => handlePress(dish)}>
          <Image source={{uri: dish.image}} style={styles.dishImage} />
          <View style={styles.dishInfo}>
            <Text style={styles.dishName}>{dish.dishName}</Text>
            <Text style={styles.dishPrice}>{formatPrice(dish.price)}đ</Text>
            <Text style={styles.storeName}>Cửa hàng: {dish.store}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  dishCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    padding: 10,
  },
  pressedCard: {
    transform: [{scale: 0.95}],
    shadowOpacity: 0.1,
  },
  dishImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
  },
  dishInfo: {
    marginTop: 5,
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4c8d6e',
  },
  dishPrice: {
    fontSize: 16,
    color: '#ff5722',
    marginTop: 5,
  },
  storeName: {
    fontSize: 14,
    color: '#888',
    marginTop: 3,
  },
});

export default PopularDishes;
