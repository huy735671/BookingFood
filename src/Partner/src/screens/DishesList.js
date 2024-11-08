import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const DishesList = ({ dishes }) => (
  <ScrollView>
    {dishes.length === 0 ? (
      <Text style={styles.noDishesText}>Không có món ăn nào trong danh sách.</Text>
    ) : (
        dishes.map((dish, index) => (
            <View key={dish.id || index} style={styles.dishContainer}> 
              <View style={styles.statusContainer}>
                <Text style={styles.dishName}>{dish.dishName}</Text>
                <Text style={styles.dishDetails}>{dish.status}</Text>
              </View>
              <Text style={styles.dishDetails}>{dish.type}</Text>
              <View style={styles.priceButtonContainer}>
                <Text style={styles.dishPrice}>
                  {dish.price ? `${dish.price.toLocaleString()} đ` : 'Chưa có giá'}
                </Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton}>
                    <Text style={styles.buttonText}>Sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton}>
                    <Text style={styles.buttonText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
          
    )}
  </ScrollView>
);

const styles = StyleSheet.create({
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dishContainer: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  dishDetails: {
    fontSize: 14,
    color: '#666',
  },
  priceButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },
  dishPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 5,
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: 80,
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 10,
    backgroundColor: '#FF0000',
    padding: 10,
    borderRadius: 5,
    width: 80,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  noDishesText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#999',
    marginTop: 20,
  },
});

export default DishesList;
