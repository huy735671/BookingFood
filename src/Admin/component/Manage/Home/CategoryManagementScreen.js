import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage'; // Import Firebase Storage
import {launchImageLibrary} from 'react-native-image-picker'; // Import image picker
import Icon from '../../../../component/Icon';
import {colors, sizes} from '../../../../constants/theme';

const CategoryManagementScreen = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryImage, setCategoryImage] = useState(null); // State to store the image

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('categoriesHome')
      .onSnapshot(snapshot => {
        const categoriesList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCategories(categoriesList);
      });

    return () => unsubscribe();
  }, []);

  // Thêm danh mục mới
  const handleAddCategory = async () => {
    if (newCategoryName.trim() === '') {
      Alert.alert('Lỗi', 'Tên danh mục không thể để trống');
      return;
    }

    let imageUrl = null;
    if (categoryImage) {
      // Upload ảnh lên Firebase Storage
      const imageRef = storage().ref(`categories/${categoryImage.fileName}`);
      await imageRef.putFile(categoryImage.uri);
      imageUrl = await imageRef.getDownloadURL(); // Lấy URL ảnh sau khi upload
    }

    const categoryData = {
      name: newCategoryName,
      image: imageUrl, // Save the image URL if available
    };

    firestore()
      .collection('categoriesHome')
      .add(categoryData)
      .then(() => {
        setNewCategoryName('');
        setCategoryImage(null); // Clear image after adding
        Alert.alert('Thành công', 'Danh mục đã được thêm');
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi thêm danh mục');
      });
  };

  // Cập nhật danh mục
  const handleUpdateCategory = async () => {
    if (categoryToEdit && categoryToEdit.name.trim() === '') {
      Alert.alert('Lỗi', 'Tên danh mục không thể để trống');
      return;
    }

    let imageUrl = categoryToEdit.image;
    if (categoryImage) {
      // Upload ảnh lên Firebase Storage nếu có ảnh mới
      const imageRef = storage().ref(`categories/${categoryImage.fileName}`);
      await imageRef.putFile(categoryImage.uri);
      imageUrl = await imageRef.getDownloadURL(); // Lấy URL ảnh mới
    }

    const updatedCategory = {
      name: categoryToEdit.name,
      image: imageUrl, // Save the updated image URL
    };

    firestore()
      .collection('categoriesHome')
      .doc(categoryToEdit.id)
      .update(updatedCategory)
      .then(() => {
        setIsModalVisible(false);
        Alert.alert('Thành công', 'Danh mục đã được cập nhật');
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật danh mục');
      });
  };

  // Chọn hình ảnh từ thư viện
  const handleSelectImage = () => {
    launchImageLibrary({mediaType: 'photo'}, response => {
      if (response.assets) {
        setCategoryImage(response.assets[0]);
      } else {
        Alert.alert('Lỗi', 'Không chọn được hình ảnh');
      }
    });
  };

  // Xóa danh mục
  const handleDeleteCategory = id => {
    firestore()
      .collection('categoriesHome')
      .doc(id)
      .delete()
      .then(() => {
        Alert.alert('Thành công', 'Danh mục đã được xóa');
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi xóa danh mục');
      });
  };

  return (
    <View style={styles.container}>
      {/* Thêm danh mục */}
      <View style={styles.formGroup}>
        <TextInput
          style={styles.input}
          value={newCategoryName}
          onChangeText={setNewCategoryName}
          placeholder="Nhập tên danh mục mới"
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Text style={styles.addButtonText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách danh mục */}
      <FlatList
        data={categories}
        renderItem={({item}) => (
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <View style={styles.categoryActions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => {
                  setCategoryToEdit(item);
                  setCategoryImage(item.image ? {uri: item.image} : null); // Load image when editing
                  setIsModalVisible(true);
                }}>
                <Icon icon="edit" size={24} color={colors.primary} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleDeleteCategory(item.id)}>
                <Icon icon="trash" size={24} color={colors.red} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id}
      />

      {/* Modal chỉnh sửa danh mục */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa danh mục</Text>
            <TextInput
              style={styles.modalInput}
              value={categoryToEdit ? categoryToEdit.name : ''}
              onChangeText={text =>
                setCategoryToEdit({...categoryToEdit, name: text})
              }
              placeholder="Nhập tên danh mục"
            />

            {/* Hiển thị ảnh đã chọn hoặc ảnh cũ */}
            {categoryToEdit && categoryToEdit.image ? (
              <View style={styles.imageContainer}>
                <Text>Hình ảnh hiện tại:</Text>
                <Image
                  source={{uri: categoryToEdit.image}}
                  style={styles.imagePreview}
                />
              </View>
            ) : null}

            <TouchableOpacity
              onPress={handleSelectImage}
              style={styles.imageButton}>
              <Text style={styles.modalImageButton}>
                {categoryImage ? 'Thay đổi hình ảnh' : 'Chọn hình ảnh'}
              </Text>
            </TouchableOpacity>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.modalSaveButton}
                onPress={handleUpdateCategory}>
                <Text style={styles.modalSaveButtonText}>Lưu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setIsModalVisible(false)}>
                <Text style={styles.modalCancelButtonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },

  formGroup: {
    marginBottom: 15,
    flexDirection: 'row',
  },
  input: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    flex: 1,
  },
  addButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: colors.green,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: sizes.h3,
  },
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  categoryName: {
    fontSize: sizes.h3,
    color: colors.primary,
  },
  categoryActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    width: '80%',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: sizes.h3,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  modalInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 5,
    paddingLeft: 10,
    borderColor: '#ddd',
  },
  modalImageButton: {
    color: colors.light,
    fontSize: sizes.h4,
    fontWeight:'bold',
  },
  imageButton: {
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 5,
    borderRadius: 5,
    padding: 10,
    backgroundColor:colors.lightGray,
    borderColor: '#ddd',
  },
  buttonContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
  },
  modalSaveButton: {
    backgroundColor: colors.green,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  modalSaveButtonText: {
    color: 'white',
    fontSize: sizes.h4,
    fontWeight: 'bold',
  },
  modalCancelButton: {
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5,
    alignItems: 'center',
    width: '45%',
  },
  modalCancelButtonText: {
    color: 'black',
    fontSize: sizes.h4,
    fontWeight: 'bold',
  },
  imageContainer: {
    marginBottom: 15,
    alignItems: 'center',
  },
  imagePreview: {
    width: 200,
    height: 100,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default CategoryManagementScreen;
