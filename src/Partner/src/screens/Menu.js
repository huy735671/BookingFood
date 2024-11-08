import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Modal,
} from 'react-native';
import HeaderPartner from '../component/HeaderPartner';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {colors, sizes} from '../../../constants/theme';
import DishesList from './DishesList';
import CategoriesList from '../component/Menu/CategoriesList';
import Icon from '../../../component/Icon';

const Menu = () => {
  const [dishes, setDishes] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const user = auth().currentUser;
        const email = user?.email;

        if (email) {
          const dishesSnapshot = await firestore()
            .collection('dishes')
            .where('ownerEmail', '==', email)
            .get();

          const dishesList = dishesSnapshot.docs.map(doc => doc.data());
          setDishes(dishesList);
        }
      } catch (error) {
        console.log('Error fetching dishes:', error);
      }
    };

    fetchDishes();
  }, []);

  return (
    <View style={styles.container}>
      <HeaderPartner />
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm món ăn..."
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}>
          <Text style={styles.buttonText}>Thêm</Text>
        </TouchableOpacity>
      </View>

      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalSize}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.title}>Tùy chọn thêm</Text>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseButton}>
                <Icon icon="close" size={30} />
              </TouchableOpacity>
            </View>
            <View style={styles.modalContent}>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('ManageCategories');
                  setModalVisible(false);
                }}
                style={styles.modalOption}>
                <Text style={styles.buttonText}>Thêm thực đơn</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('AddDishScreen');
                  setModalVisible(false);
                }}
                style={styles.modalOption}>
                <Text style={styles.buttonText}>Thêm món ăn</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <CategoriesList />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: 100,
    alignItems: 'center',
  },
  buttonText: {
    color: colors.primary,
    textAlign: 'center',
    fontSize: sizes.h3,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalSize: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  title: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: sizes.h2,
  },

  modalContent: {
    alignItems: 'center',
    borderTopWidth:1,
    borderColor:'#ddd',
  },
  modalOption: {
    marginVertical: 10,
  },
  modalCloseButton: {
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default Menu;
