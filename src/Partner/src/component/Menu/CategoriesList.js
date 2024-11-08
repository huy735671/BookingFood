import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {colors, sizes} from '../../../../constants/theme';
import Icon from '../../../../component/Icon';
import { useNavigation } from '@react-navigation/native';

const CategoriesList = () => {
  const [categories, setCategories] = useState([]);
  const [dishes, setDishes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [categoryNames, setCategoryNames] = useState({});
  const navigation = useNavigation();
  
  useEffect(() => {
    const fetchCategoriesAndDishes = async () => {
      try {
        const userEmail = auth().currentUser?.email;
        if (!userEmail) return;

        // Lấy các danh mục thuộc về user hiện tại
        const categoriesSnapshot = await firestore()
          .collection('categories')
          .where('ownerEmail', '==', userEmail)
          .get();

        const fetchedCategories = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
        }));

        // Thêm mục "Tất cả" vào đầu danh sách danh mục
        setCategories([{id: 'all', name: 'Tất cả'}, ...fetchedCategories]);

        // Lấy toàn bộ món ăn của quán hiện tại
        const dishesSnapshot = await firestore()
          .collection('dishes')
          .where('ownerEmail', '==', userEmail) // Lọc món ăn theo ownerEmail
          .get();

        const fetchedDishes = dishesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Lấy tên danh mục cho mỗi món ăn
        const categoryNamesMap = {};
        fetchedDishes.forEach(dish => {
          dish.categories.forEach(categoryId => {
            const category = fetchedCategories.find(
              cat => cat.id === categoryId,
            );
            if (category) {
              categoryNamesMap[dish.id] = categoryNamesMap[dish.id] || [];
              categoryNamesMap[dish.id].push(category.name);
            }
          });
        });

        setCategoryNames(categoryNamesMap);
        setDishes(fetchedDishes);
        filterDishesByCategory('all');

      } catch (error) {
        console.error('Error fetching categories or dishes: ', error);
      }
    };

    fetchCategoriesAndDishes();
  }, []);

  const filterDishesByCategory = async categoryId => {
    setSelectedCategory(categoryId);

    const userEmail = auth().currentUser?.email;
    if (!userEmail) return;

    if (categoryId === 'all') {
      // Lấy tất cả món ăn của quán hiện tại
      const dishesSnapshot = await firestore()
        .collection('dishes')
        .where('ownerEmail', '==', userEmail) 
        .get();
      setDishes(
        dishesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    } else {
      
      const dishesSnapshot = await firestore()
        .collection('dishes')
        .where('ownerEmail', '==', userEmail) 
        .where('categories', 'array-contains', categoryId)
        .get();

      setDishes(
        dishesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })),
      );
    }
  };

  const formatPrice = price => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>Danh mục:</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.scrollContainer}
        contentContainerStyle={styles.categoriesContainer}>
        {categories.map(category => (
          <TouchableOpacity
            key={category.id}
            style={[
              styles.categoryItem,
              selectedCategory === category.id && styles.selectedCategory,
            ]}
            onPress={() => filterDishesByCategory(category.id)}>
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Các món ăn:</Text>
      {dishes.length === 0 ? (
        <Text style={styles.noDishesText}>
          Không có món ăn nào trong danh mục đã chọn.
        </Text>
      ) : (
        dishes.map(dish => (
          <View key={dish.id} style={styles.dishContainer}>
            <View style={styles.dishNameContainer}>
              <Text style={styles.dishName}>{dish.dishName}</Text>
              <Text style={styles.availableText}>
                {dish.isAvailable ? 'Có sẵn' : 'Hết hàng'}
              </Text>
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingVertical: 10,
              }}>
              <Text style={styles.categoryText}>
                {categoryNames[dish.id]
                  ? categoryNames[dish.id].join(', ')
                  : 'Không có danh mục'}
              </Text>

              <Text style={styles.dishPrice}>
                {formatPrice(dish.price)} đ
              </Text>
            </View>
            <View style={styles.editContainer}>
              <TouchableOpacity style={styles.editButton} onPress={() => navigation.navigate('EditDishScreen', { dishId: dish.id })}>
                <Text style={styles.editButtonText}>Sửa</Text>
                <Icon icon="edit" size={20} color="black" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.editDeleteText}>Xóa</Text>
                <Icon icon="trash" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        ))
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  scrollContainer: {
    paddingVertical: 10,
  },
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryItem: {
    backgroundColor: '#ddd',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
  },
  selectedCategory: {
    backgroundColor: '#007BFF',
  },
  categoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  noDishesText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginVertical: 20,
  },
  dishContainer: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ddd',
  },
  dishNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dishName: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    color: colors.primary,
  },
  categoryText: {
    fontSize: sizes.h3,
    color: colors.gray,
  },
  availableText: {
    fontSize: 14,
    color: colors.light,
    borderWidth: 1,
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    fontWeight: 'bold',
  },
  dishPrice: {
    fontSize: sizes.h3,
    color: colors.primary,
    fontWeight:'bold',
  },
  editContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  editButton: {
    flexDirection: 'row-reverse',
    borderWidth: 1,
    padding: 5,
    marginRight: 20,
    alignItems: 'center',
    borderRadius: 5,
  },
  editButtonText: {
    marginLeft: 5,
    fontSize: 18,
    color: colors.primary,
    fontWeight: 'bold',
    borderRadius: 5,
  },
  deleteButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    borderWidth: 1,
    padding: 5,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  editDeleteText: {
    marginLeft: 5,
    fontSize: 18,
    color: colors.light,
    fontWeight: 'bold',
  },
});

export default CategoriesList;
