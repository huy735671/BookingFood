import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Switch,
  ScrollView,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../../../constants/theme';

const EditDishScreen = () => {
  const [dish, setDish] = useState(null);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [additionalOptions, setAdditionalOptions] = useState([]);
  const [image, setImage] = useState(null);
  const navigation = useNavigation();
  const route = useRoute();
  const { dishId } = route.params;

  useEffect(() => {
    const fetchDishData = async () => {
      try {
        const dishSnapshot = await firestore()
          .collection('dishes')
          .doc(dishId)
          .get();
        const dishData = dishSnapshot.data();
        setDish(dishData);
        setSelectedCategories(dishData.categories || []);
        setAdditionalOptions(dishData.additionalOptions || []);
        setImage(dishData.image || null);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu món ăn:', error);
      }
    };

    const fetchCategories = async () => {
      const userEmail = auth().currentUser.email;
      const categoriesSnapshot = await firestore()
        .collection('categories')
        .where('ownerEmail', '==', userEmail)
        .get();
      const categoriesList = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));
      setCategories(categoriesList);
    };

    const fetchAdditionalOptions = async () => {
      try {
        const optionsSnapshot = await firestore()
          .collection('options')
          .where('dishId', '==', dishId) // Lọc các tùy chọn theo dishId
          .get();
        const optionsList = optionsSnapshot.docs.map(doc => doc.data().name);
        setAdditionalOptions(optionsList);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu tùy chọn bổ sung:', error);
      }
    };

    fetchDishData();
    fetchCategories();
    fetchAdditionalOptions(); // Lấy dữ liệu từ collection options

  }, [dishId]);

  const handleImagePick = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 1 }, async response => {
      if (!response.didCancel && !response.errorCode) {
        const selectedImage = response.assets[0];
        const imageUri = selectedImage.uri;
        try {
          const imageName = `${Date.now()}.jpg`;
          const reference = storage().ref(imageName);
          await reference.putFile(imageUri);
          const imageUrl = await reference.getDownloadURL();
          setImage(imageUrl);
        } catch (error) {
          console.error('Lỗi khi tải lên hình ảnh:', error);
        }
      }
    });
  };

  const handleCategoryChange = categoryId => {
    setSelectedCategories(prevSelectedCategories => {
      if (prevSelectedCategories.includes(categoryId)) {
        return prevSelectedCategories.filter(id => id !== categoryId);
      } else {
        return [...prevSelectedCategories, categoryId];
      }
    });
  };

  const formatPrice = price => {
    if (!price) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleAddOption = () => {
    setAdditionalOptions([...additionalOptions, '']);
  };

  const handleSave = async () => {
    try {
      await firestore()
        .collection('dishes')
        .doc(dishId)
        .update({
          ...dish,
          categories: selectedCategories,
          additionalOptions,
          image,
        });
      console.log('Món ăn đã được cập nhật');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi cập nhật món ăn:', error);
    }
  };

  if (!dish) {
    return <Text>Đang tải...</Text>;
  }

  const renderCategoryRows = () => {
    const rows = [];
    for (let i = 0; i < categories.length; i += 3) {
      const rowCategories = categories.slice(i, i + 3);
      rows.push(
        <View key={`row-${i}`} style={styles.row}>
          {rowCategories.map(category => (
            <View key={category.id} style={styles.checkboxContainer}>
              <CheckBox
                value={selectedCategories.includes(category.id)}
                onValueChange={() => handleCategoryChange(category.id)}
              />
              <Text>{category.name}</Text>
            </View>
          ))}
        </View>,
      );
    }
    return rows;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Tên món ăn</Text>
        <TextInput
          style={styles.input}
          value={dish.dishName}
          onChangeText={text => setDish({ ...dish, dishName: text })}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={[styles.input, styles.descriptionInput]}
          value={dish.description}
          onChangeText={text => setDish({ ...dish, description: text })}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Danh mục</Text>
        {renderCategoryRows()}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Giá (VNĐ)</Text>
        <TextInput
          style={styles.input}
          value={formatPrice(dish.price)}
          keyboardType="numeric"
          onChangeText={text => {
            const unformattedPrice = text.replace(/\./g, '');
            setDish({ ...dish, price: unformattedPrice });
          }}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hình ảnh món ăn</Text>
        <TouchableOpacity onPress={handleImagePick} style={styles.imageBox}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <Text style={styles.buttonText}>Chọn ảnh</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer2}>
        <Text style={styles.label}>Có sẵn để đặt hàng</Text>
        <Switch
          value={dish.isAvailable}
          onValueChange={value => setDish({ ...dish, isAvailable: value })}
        />
      </View>

      <View style={styles.inputContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Tùy chọn bổ sung</Text>
          <TouchableOpacity
            onPress={handleAddOption}
            style={styles.addOptionButton}>
            <Icon name="add" size={30} color={colors.primary} />
          </TouchableOpacity>
        </View>
        {additionalOptions.map((option, index) => (
          <View key={index} style={styles.optionContainer}>
            <TextInput
              style={styles.optionInput}
              placeholder="Ví dụ: Không hành"
              value={option}
              onChangeText={text => {
                const updatedOptions = [...additionalOptions];
                updatedOptions[index] = text;
                setAdditionalOptions(updatedOptions);
              }}
            />
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => {
                const updatedOptions = additionalOptions.filter(
                  (_, i) => i !== index,
                );
                setAdditionalOptions(updatedOptions);
              }}>
              <Icon name="delete" size={30} color="red" />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <TouchableOpacity onPress={handleSave} style={styles.addButton}>
        <Text style={styles.buttonAddText}>Lưu thay đổi</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputContainer2: {
    marginVertical: 15,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    fontSize: 16,
  },
  descriptionInput: {
    height: 250,
    fontSize: 16,
    lineHeight: 20,
  },
  imageBox: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginTop: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    marginTop: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonAddText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonText: {
    fontSize: 16,
    color: colors.primary,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '33%',
  },
  addOptionButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginLeft: 'auto',
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionInput: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    padding: 10,
  },
  deleteButton: {
    paddingLeft: 10,
  },
});

export default EditDishScreen;
