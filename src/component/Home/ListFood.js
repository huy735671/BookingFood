import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {colors, sizes} from '../../constants/theme';
import Icon from '../Icon';

const ListFood = ({route}) => {
  const {categoryId} = route.params;
  const [dishes, setDishes] = useState([]);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const snapshot = await firestore()
          .collection('dishes')
          .where('categoriesHome', 'array-contains', categoryId)
          .get();

        const dishData = snapshot.docs.map(doc => ({
          id: doc.id,
          dishName: doc.data().dishName,
          description: doc.data().description,
          price: doc.data().price,
          image: doc.data().image,
        }));

        setDishes(dishData);
      } catch (error) {
        console.error('Error fetching dishes: ', error);
      }
    };

    fetchDishes();
  }, [categoryId]);
  const formatPrice = price => {
    if (!price) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={dishes}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.dishItem}>
            {item.image ? (
              <Image source={{uri: item.image}} style={styles.dishImage} />
            ) : (
              <View style={styles.defaultImage} />
            )}
            <View style={styles.infoContainer}>
              <Text style={styles.dishName}>{item.dishName}</Text>
              <Text style={styles.dishPrice}>{formatPrice(item.price)}đ</Text>
            </View>

            {/* Các nút */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => console.log('Xem chi tiết')}>
                <Text style={styles.buttonText}>Chi tiết</Text>
                <Icon
                  icon="ArrowRight"
                  size={15}
                  color="white"
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.buttonCart}
              onPress={() => console.log('Thêm vào giỏ hàng')}>
              <Icon icon="Cart" size={30} color="black" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  dishItem: {
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 3,
    flexDirection: 'row',
    position: 'relative',
  },
  dishImage: {
    width: 150,
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  defaultImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0',
    borderRadius: 8,
    marginBottom: 10,
  },
  infoContainer: {
    padding: 10,
    flex: 1,
  },
  dishName: {
    fontSize: sizes.h2,
    color: colors.primary,
    fontWeight: 'bold',
  },
  dishPrice: {
    fontSize: 16,
    color: '#000',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    alignItems: 'flex-end',
  },
  button: {
    backgroundColor: colors.green,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  icon: {
    marginLeft: 5,
  },
  buttonCart: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
});

export default ListFood;
