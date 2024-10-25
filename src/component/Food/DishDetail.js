import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, TextInput } from 'react-native';
import React, { useState } from 'react';
import { colors, sizes } from '../../constants/theme';

const DishDetail = ({ route }) => {
  const { dish } = route.params;
  const defaultImage =
    'https://img.lovepik.com/free_png/32/22/38/41c58PICaBUM9pReH3a9u_PIC2018.png_860.png';
  const dishImage = dish.image ? dish.image : defaultImage;

  const [note, setNote] = useState(''); // State để lưu ý cho quán

  const handlerAddToCart = () => {
    Alert.alert('Thông báo', `${dish.name} đã được thêm vào giỏ hàng`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Image source={{ uri: dishImage }} style={styles.dishImage} />
        <View style={styles.dishInfo}>
          <Text style={styles.dishName}>{dish.name}</Text>
          {/* <Text style={styles.dishPrice}>{dish.price}</Text> */}
          {/* <Text style={styles.storeName}>{dish.store}</Text> */}
          <Text style={styles.description}>
            Mô tả:
            {dish.description ? dish.description : ' Không có mô tả nào về món ăn'}
          </Text>
        </View>

        <Text style={styles.noteLabel}>Thêm lưu ý cho quán: (Không bắt buộc)</Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Nhập lưu ý của bạn ở đây"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handlerAddToCart}>
        <Text style={styles.addButtonText}>Thêm vào giỏ hàng - {dish.price}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default DishDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollContainer: {
    paddingBottom: 100, 
  },
  dishImage: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  dishInfo: {
    padding: 20,
  },
  dishName: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 10,
  },
  dishPrice: {
    fontSize: sizes.h3,
    color: colors.gray,
    marginBottom: 10,
  },
  storeName: {
    fontSize: sizes.h3,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  noteLabel: {
    fontSize: sizes.h3,
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 20,
    
  },
  addButton: {
    backgroundColor: colors.green,
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: sizes.h3,
    color: '#fff',
    fontWeight: 'bold',
  },
});
