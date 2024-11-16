import React, {useState, useEffect} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {colors} from '../../../constants/theme';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import CheckBox from '@react-native-community/checkbox';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import storage from '@react-native-firebase/storage';

const AddDishScreen = () => {
  const [dishName, setDishName] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [categoriesHome, setCategoriesHome] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [isAvailable, setIsAvailable] = useState(false);
  const [additionalOptions, setAdditionalOptions] = useState(['']);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchCategories = async () => {
      const userEmail = auth().currentUser.email;

      // Lấy dữ liệu từ collection `categories`
      const categoriesSnapshot = await firestore()
        .collection('categories')
        .where('ownerEmail', '==', userEmail)
        .get();

      const categoriesList = categoriesSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));

      setCategories(categoriesList);

      // Lấy dữ liệu từ collection `categoriesHome`
      const categoriesHomeSnapshot = await firestore()
        .collection('categoriesHome')
        .get();

      const categoriesHomeList = categoriesHomeSnapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().name,
      }));

      setCategoriesHome(categoriesHomeList);
    };

    fetchCategories();
  }, []);

  const handleCategoryChange = categoryId => {
    setSelectedCategories(prevSelectedCategories => {
      if (prevSelectedCategories.includes(categoryId)) {
        return prevSelectedCategories.filter(id => id !== categoryId);
      } else {
        return [...prevSelectedCategories, categoryId];
      }
    });
  };
  const [selectedCategoriesHome, setSelectedCategoriesHome] = useState([]);

const handleHomeCategoryChange = categoryId => {
  setSelectedCategoriesHome(prevSelectedCategories => {
    if (prevSelectedCategories.includes(categoryId)) {
      return prevSelectedCategories.filter(id => id !== categoryId);
    } else {
      return [...prevSelectedCategories, categoryId];
    }
  });
};

const renderCategoriesHome = () => {
  const rows = [];
  for (let i = 0; i < categoriesHome.length; i += 2) {
    const rowCategories = categoriesHome.slice(i, i + 2);
    rows.push(
      <View key={`home-row-${i}`} style={styles.row}>
        {rowCategories.map(category => (
          <View key={category.id} style={styles.categoryContainer}>
            <CheckBox
              value={selectedCategoriesHome.includes(category.id)}
              onValueChange={() => handleHomeCategoryChange(category.id)}
            />
            <Text>{category.name}</Text>
          </View>
        ))}
      </View>
    );
  }
  return rows;
};


  const handleImagePick = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, async response => {
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

  const handleAddOption = () => {
    setAdditionalOptions([...additionalOptions, '']);
  };

  const handleSubmit = async () => {
    const userEmail = auth().currentUser.email;
  
    const newDish = {
      dishName,
      description,
      categories: selectedCategories,  // danh mục từ categories
      categoriesHome: selectedCategoriesHome,  // danh mục từ categoriesHome
      price,
      image,
      isAvailable,
      ownerEmail: userEmail,
    };
  
    try {
      const dishRef = await firestore().collection('dishes').add(newDish);
      console.log('Món ăn đã được thêm:', newDish);
  
      const additionalOptionsData = additionalOptions.map(option => ({
        dishId: dishRef.id,
        option,
      }));
  
      const batch = firestore().batch();
      additionalOptionsData.forEach(optionData => {
        const optionRef = firestore().collection('options').doc();
        batch.set(optionRef, optionData);
      });
  
      await batch.commit();
      console.log('Tùy chọn bổ sung đã được lưu thành công');
  
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi thêm món ăn và tùy chọn bổ sung:', error);
    }
  };
  

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
          placeholder="Nhập tên món ăn"
          value={dishName}
          onChangeText={setDishName}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mô tả</Text>
        <TextInput
          style={styles.input}
          placeholder="Mô tả ngắn gọn về món ăn"
          value={description}
          onChangeText={setDescription}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Danh mục</Text>
        {renderCategoryRows()}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Danh mục từ categoriesHome</Text>
        {renderCategoriesHome()}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Giá (VNĐ)</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập giá món ăn"
          value={price}
          keyboardType="numeric"
          onChangeText={setPrice}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Hình ảnh món ăn</Text>
        <TouchableOpacity onPress={handleImagePick} style={styles.imageBox}>
          {image ? (
            <Image source={{uri: image}} style={styles.image} />
          ) : (
            <Text style={styles.buttonText}>Thêm ảnh</Text>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer2}>
        <Text style={styles.label}>Có sẵn để đặt hàng</Text>
        <Switch value={isAvailable} onValueChange={setIsAvailable} />
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

      <TouchableOpacity onPress={handleSubmit} style={styles.addButton}>
        <Text style={styles.buttonAddText}>Thêm món ăn</Text>
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
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '30%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  categoryContainer: {
    width: '48%', 
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: '#ccc',
    borderRadius: 5,
  },
  imageBox: {
    marginTop: 10,
    borderColor: '#ddd',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    height: 150,
  },
  image: {
    width: 250,
    height: 150,
    resizeMode: 'cover',
  },
  buttonText: {
    color: colors.primary,
    fontSize: 16,
  },
  addOptionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 20,
    marginBottom: 2,
  },
  addButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  buttonAddText: {
    color: colors.light,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  optionInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  deleteButton: {
    marginLeft: 10,
  },
});

export default AddDishScreen;
