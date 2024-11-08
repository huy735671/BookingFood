import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, StyleSheet } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from '../../../component/Icon';

const ManageCategoriesScreen = ({ navigation }) => {
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState(null); 
  const currentUser = auth().currentUser;
  const [email, setEmail] = useState('');

  useEffect(() => {
    if (currentUser) {
      setEmail(currentUser.email);
    }
  }, [currentUser]);

  useEffect(() => {
    if (email) {
      const unsubscribe = firestore()
        .collection('categories')
        .where('ownerEmail', '==', email)
        .onSnapshot(querySnapshot => {
          const categoriesList = [];
          querySnapshot.forEach(documentSnapshot => {
            categoriesList.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          });
          setCategories(categoriesList);
        });

      return () => unsubscribe();
    }
  }, [email]);

  const handleAddCategory = async () => {
    if (newCategory.trim() && email) {
      try {
        await firestore()
          .collection('categories')
          .add({
            name: newCategory,
            ownerEmail: email,
          });
        setNewCategory('');
      } catch (error) {
        console.error('Lỗi khi thêm danh mục:', error);
      }
    }
  };

  const handleEditCategory = (id, name) => {
    setSelectedCategory({ id, name });
    setIsModalVisible(true); 
  };

  const handleSaveCategory = async () => {
    if (selectedCategory) {
      try {
        await firestore()
          .collection('categories')
          .doc(selectedCategory.id)
          .update({
            name: selectedCategory.name,
          });
        setIsModalVisible(false); 
      } catch (error) {
        console.error('Lỗi khi cập nhật danh mục:', error);
      }
    }
  };

  const handleDeleteCategory = async () => {
    if (selectedCategory) {
      try {
        await firestore().collection('categories').doc(selectedCategory.id).delete();
        setIsModalVisible(false); 
      } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Thêm danh mục mới</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên danh mục"
          value={newCategory}
          onChangeText={setNewCategory}
        />
        <TouchableOpacity style={styles.addButton} onPress={handleAddCategory}>
          <Icon icon="Add"  size={40}/>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>Danh sách danh mục</Text>
      <FlatList
        data={categories}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.categoryItem}>
            <Text style={styles.categoryName}>{item.name}</Text>
            <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() => handleEditCategory(item.id, item.name)}
            >
              <Text>Sửa</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => handleDeleteCategory(item.id)}
            >
              <Text>Xóa</Text>
            </TouchableOpacity>
            </View>
          </View>
        )}
      />

      {/* Modal chỉnh sửa danh mục */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chỉnh sửa danh mục</Text>
            <TextInput
              style={styles.modalInput}
              value={selectedCategory?.name}
              onChangeText={(text) => setSelectedCategory({ ...selectedCategory, name: text })}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalButton} onPress={handleSaveCategory}>
                <Text style={styles.buttonText}>Sửa</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalButton} onPress={handleDeleteCategory}>
                <Text style={styles.buttonText}>Xóa</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setIsModalVisible(false)}>
              <Text style={styles.buttonText}>Đóng</Text>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  buttonContainer:{
    flexDirection:'row',
    justifyContent: 'space-between', 

  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
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
    fontSize: 16,
  },
  editButton: {
    backgroundColor: '#FFD700',
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    padding: 5,
    borderRadius: 5,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Mờ nền
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
    
  },
  closeModalButton: {
    backgroundColor: '#FF6347',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
});

export default ManageCategoriesScreen;
