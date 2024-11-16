import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  StatusBar,
} from 'react-native';
import {colors, sizes} from '../../constants/theme';
import firestore from '@react-native-firebase/firestore';

const OptionsList = () => {
  const navigation = useNavigation();
  const [categories, setCategories] = useState([]);

  const defaultImage =
    'https://chupanh.vn/wp-content/uploads/2020/12/dich-vu-chup-anh-mon-an-6.jpg';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const snapshot = await firestore().collection('categoriesHome').get();
        const categoryData = snapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          image: doc.data().image || defaultImage,
        }));
        setCategories(categoryData);
      } catch (error) {
        console.error('Error fetching categories: ', error);
      }
    };

    fetchCategories();
  }, []);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.optionsContainer}>
      <StatusBar barStyle="dark-content" translucent backgroundColor="#4c8d6e" />
      {categories.map(category => (
        <TouchableOpacity
          key={category.id}
          style={styles.optionButton}
          onPress={() =>
            navigation.navigate('ListFood', {categoryId: category.id})
          } 
        >
          <Image source={{uri: category.image}} style={styles.optionImage} />
          <Text style={styles.optionText}>{category.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    marginVertical: 10,
    paddingVertical: 5,
  },
  optionButton: {
    alignItems: 'center',
    marginRight: 10,
  },
  optionImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 5,
  },
  optionText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: sizes.body,
  },
});

export default OptionsList;
