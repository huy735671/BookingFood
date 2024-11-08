import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native';
import {colors, sizes} from '../../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';

const AddToCartModal = ({visible, onClose, dish, dishOptions, onAddToCart}) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionSelect = option => {
    setSelectedOptions(prevOptions =>
      prevOptions.includes(option)
        ? prevOptions.filter(opt => opt !== option)
        : [...prevOptions, option],
    );
  };

  const formatPrice = price => {
    if (!price) return '';
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={styles.modalContent}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon name="times" size={24} color="white" />
            </TouchableOpacity>

            <Image
              source={{
                uri:
                  dish.image ||
                  'https://img.lovepik.com/free_png/32/22/38/41c58PICaBUM9pReH3a9u_PIC2018.png_860.png',
              }}
              style={styles.dishImage}
            />

            <Text style={styles.dishName}>{dish.dishName}</Text>
            <Text style={styles.dishPrice}>{formatPrice(dish.price)}đ</Text>

            {dishOptions && dishOptions.length > 0 && (
              <View style={styles.optionsContainer}>
                {dishOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.optionButton}
                    onPress={() => handleOptionSelect(option)}>
                    <Text style={styles.optionText}>{option}</Text>
                    {selectedOptions.includes(option) && (
                      <Icon name="check" size={18} color={colors.green} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <TouchableOpacity
              style={styles.addButton}
              onPress={() => {
                onAddToCart(dish, selectedOptions);
                onClose();
              }}>
              <Text style={styles.addButtonText}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};


const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: '100%',
    height: '60%',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: colors.primary,
    borderRadius: 30,
    padding: 5,
    zIndex: 1,
  },
  dishImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  dishName: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
  },
  dishPrice: {
    fontSize: sizes.h3,
    color: colors.gray,
    marginBottom: 20,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  optionText: {
    fontSize: sizes.h3,
    color: colors.primary,
  },
  addButton: {
    backgroundColor: colors.green,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: sizes.h3,
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default AddToCartModal;
