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
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from '../../../../component/Icon';
import {colors, sizes} from '../../../../constants/theme';

const CategoryManagementScreen = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  // Lấy danh sách danh mục từ Firestore (collection categoriesHome)
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('categoriesHome')  // Cập nhật collection ở đây
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
  const handleAddCategory = () => {
    if (newCategoryName.trim() === '') {
      Alert.alert('Lỗi', 'Tên danh mục không thể để trống');
      return;
    }

    firestore()
      .collection('categoriesHome')  // Cập nhật collection ở đây
      .add({
        name: newCategoryName,
      })
      .then(() => {
        setNewCategoryName('');
        Alert.alert('Thành công', 'Danh mục đã được thêm');
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi thêm danh mục');
      });
  };

  // Cập nhật danh mục
  const handleUpdateCategory = () => {
    if (categoryToEdit && categoryToEdit.name.trim() === '') {
      Alert.alert('Lỗi', 'Tên danh mục không thể để trống');
      return;
    }

    firestore()
      .collection('categoriesHome')  // Cập nhật collection ở đây
      .doc(categoryToEdit.id)
      .update({
        name: categoryToEdit.name,
      })
      .then(() => {
        setIsModalVisible(false);
        Alert.alert('Thành công', 'Danh mục đã được cập nhật');
      })
      .catch(error => {
        console.error(error);
        Alert.alert('Lỗi', 'Có lỗi xảy ra khi cập nhật danh mục');
      });
  };

  // Xóa danh mục
  const handleDeleteCategory = id => {
    firestore()
      .collection('categoriesHome')  // Cập nhật collection ở đây
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
    width: 300,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.primary,
  },
  modalInput: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
    marginBottom: 20,
    width: '100%',
  },
  modalSaveButton: {
    backgroundColor: colors.green,
    paddingVertical: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  modalSaveButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: sizes.h3,
  },
  modalCancelButton: {
    backgroundColor: colors.red,
    paddingVertical: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalCancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: sizes.h3,
  },
});

export default CategoryManagementScreen;
