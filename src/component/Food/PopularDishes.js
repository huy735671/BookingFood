import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

const PopularDishes = ({ dishes }) => {
  const [pressedIndex, setPressedIndex] = useState(null);

  return (
    <View style={styles.container}>
      {dishes.map((dish, index) => (
        <TouchableOpacity
          key={dish.id}
          style={[
            styles.dishCard,
            pressedIndex === index && styles.pressedCard,
          ]}
          onPressIn={() => setPressedIndex(index)} 
          onPressOut={() => setPressedIndex(null)} 
        >
          <Image source={{ uri: dish.image }} style={styles.dishImage} />
          <View style={styles.dishInfo}>
            <Text style={styles.dishName}>{dish.name}</Text>
            <Text style={styles.dishPrice}>{dish.price}</Text>
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
  },
  dishCard: {
    width: '48%', // Chia đôi không gian
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    padding: 10,
  },
  pressedCard: {
    transform: [{ scale: 0.95 }], // Thu nhỏ khi nhấn
    shadowOpacity: 0.1, // Giảm độ bóng khi nhấn
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
