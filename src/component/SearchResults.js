import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { colors } from '../constants/theme';

const SearchResults = () => {
  const { params } = useRoute();
  const { dishes, query } = params || [];


  const formatPrice = (price) => {
    if (!price) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kết quả với "{query}"</Text>
      <ScrollView>
        {dishes.length > 0 ? (
          dishes.map(dish => (
            <TouchableOpacity key={dish.id} style={styles.dishItem}>
              <Text style={styles.dishName}>{dish.dishName}</Text>
              <Text style={styles.dishName}>{formatPrice(dish.price)}đ</Text>
              <Text style={styles.dishOwner}>Cửa hàng: {dish.ownerEmail}</Text>
            </TouchableOpacity>
          ))
        ) : (
          <Text style={styles.noResults}>Không có kết quả nào!</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: colors.primary,
  },
  dishItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  dishOwner: {
    fontSize: 16,
    color: colors.gray,
  },
  noResults: {
    fontSize: 18,
    color: colors.gray,
    textAlign: 'center',
  },
});

export default SearchResults;
