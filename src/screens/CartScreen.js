import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import { colors, sizes } from '../constants/theme';

const CartScreen = () => {
  const [items, setItems] = useState([
    { id: '1', name: 'Bánh mì thịt', price: 10000, quantity: 1, selected: false, store: 'Cửa hàng A' },
    { id: '2', name: 'Bánh mì chả cá', price: 20000, quantity: 1, selected: false, store: 'Cửa hàng A' },
    { id: '3', name: 'Phở bò', price: 30000, quantity: 1, selected: false, store: 'Cửa hàng B' },
    { id: '4', name: 'Bún bò Huế', price: 15000, quantity: 1, selected: false, store: 'Cửa hàng B' },
  ]);

  const toggleSelectItem = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const updateQuantity = (id, increment) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(item.quantity + increment, 1) }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setItems((prevItems) => prevItems.filter(item => item.id !== id));
  };

  const totalPrice = items.reduce((total, item) => {
    return item.selected ? total + item.price * item.quantity : total;
  }, 0);

  const handleOrder = () => {
    console.log("Đặt hàng với tổng giá: ", totalPrice);
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.store]) {
      acc[item.store] = [];
    }
    acc[item.store].push(item);
    return acc;
  }, {});

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Giỏ hàng của bạn</Text>
      {Object.keys(groupedItems).map((store) => (
        <View key={store} style={styles.storeContainer}>
          <Text style={styles.storeTitle}>{store}</Text>
          {groupedItems[store].map((item) => (
            <View key={item.id} style={styles.itemContainer}>
              <CheckBox
                value={item.selected}
                onValueChange={() => toggleSelectItem(item.id)}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemPrice}>{formatCurrency(item.price)}</Text>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                  <Text style={styles.quantityButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                  <Text style={styles.quantityButton}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Text style={styles.removeButton}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}
      
      <View style={{position:'absolute',bottom:0,right:0,left:0, padding:20,}}>
        <View style={styles.footer}>
        <Text style={styles.totalText}>Tổng cộng:</Text>
        <Text style={styles.totalAmount}>{formatCurrency(totalPrice)}</Text>
        </View>
      
      <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
        <Text style={styles.orderButtonText}>Tiến hành đặt hàng</Text>
      </TouchableOpacity> 
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  storeContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  storeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: sizes.h3,
  },
  itemPrice: {
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 18,
    paddingHorizontal: 10,
  },
  quantity: {
    fontSize: 18,
    width: 30,
    textAlign: 'center',
  },
  removeButton: {
    fontSize: 18,
    color: 'red',
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  orderButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  orderButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
  },
});

export default CartScreen;
