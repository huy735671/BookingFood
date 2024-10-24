import {Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors, sizes} from '../../constants/theme';

const DishDetail = ({route}) => {
  const {dish} = route.params;
  const defaultImage =
    'https://img.lovepik.com/free_png/32/22/38/41c58PICaBUM9pReH3a9u_PIC2018.png_860.png';
  const dishImage = dish.image ? dish.image : defaultImage;


  const handlerAddToCart =()=>{
    Alert.alert('Thông báo', `${dish.name} đã được thêm vào giỏ hàng`)
  }
  return (
    <View style={styles.container}>
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Image source={{uri: dishImage}} style={styles.dishImage} />
      <View style={styles.dishInfo}>
        <Text style={styles.dishName}>{dish.name} </Text>
        
        <Text style={styles.dishPrice}>{dish.price} </Text>
        <Text style={styles.storeName}>{dish.store} </Text>

        <Text style={styles.description}>
          Mô tả :
          {dish.description ? dish.description : 'Không có mô tả nào về món ăn'}
        </Text>
      </View>

      <TouchableOpacity style={styles.addBotton}  onPress={handlerAddToCart}>
        <Text style={styles.addButtonText}>Thêm vào giỏ hàng</Text>
      </TouchableOpacity>
    </ScrollView></View>
  );
};

export default DishDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollContainer:{
    paddingBottom:350,
  },
  dishImage: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius:20,
    borderBottomRightRadius:20,
  },
  dishInfo: {
    padding: 20,
  },
  dishName: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    borderBottomWidth:1,
    borderColor:'#ddd',
  },
  dishPrice:{
    fontSize:sizes.h3,
    color:colors.gray,
    marginBottom:10,
  },
  storeName:{
    fontSize:sizes.h3,
     marginBottom:20,
  },
  dishDescription: {
    fontSize: 16,
    color: '#666',
    
  },
  addBotton:{
    backgroundColor:colors.green,
    padding:15,
    margin:15,
    borderRadius:10,
    alignItems:'center',
    position:'absolute',
    bottom:0,
    left:0,
    right:0,
  },
  addButtonText:{
    fontSize:sizes.h3,
    color:'#fff',
    fontWeight:'bold',
  },
});
