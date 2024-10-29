import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  StatusBar,
} from 'react-native';
import React, {useState} from 'react';
import {colors, sizes} from '../../constants/theme';
import Icon from 'react-native-vector-icons/FontAwesome';

const DishDetail = ({route, navigation}) => {
  // Thêm navigation vào props
  const {dish} = route.params;
  const defaultImage =
    'https://img.lovepik.com/free_png/32/22/38/41c58PICaBUM9pReH3a9u_PIC2018.png_860.png';
  const dishImage = dish.image ? dish.image : defaultImage;

  const [note, setNote] = useState('');

  const handlerAddToCart = () => {
    Alert.alert('Thông báo', `${dish.name} đã được thêm vào giỏ hàng`);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <StatusBar
          barStyle="light-content"
          translucent
          backgroundColor="rgba(0,0,0,0)"
        />

        <View style={styles.imageContainer}>
          <Image source={{uri: dishImage}} style={styles.dishImage} />
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <Icon name="chevron-left" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.dishInfo}>
          <Text style={styles.dishName}>{dish.name}</Text>

          <Text style={styles.description}>
            Mô tả:
            {dish.description
              ? dish.description
              : ' Không có mô tả nào về món ăn'}
          </Text>
        </View>

        <Text style={styles.noteLabel}>
          Thêm lưu ý cho quán: (Không bắt buộc)
        </Text>
        <TextInput
          style={styles.noteInput}
          placeholder="Nhập lưu ý của bạn ở đây"
          value={note}
          onChangeText={setNote}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </ScrollView>

      <TouchableOpacity style={styles.addButton} onPress={handlerAddToCart}>
        <Text style={styles.addButtonText}>
          Thêm vào giỏ hàng - {dish.price}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default DishDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  scrollContainer: {
    paddingBottom: 100,
  },
  imageContainer: {
    position: 'relative', 
  },
  dishImage: {
    width: '100%',
    height: 250,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  backButton: {
    padding: 10,
    position: 'absolute',
    zIndex: 1,
    top: 40,
    left: 10,
    borderWidth: 1,
    backgroundColor: colors.primary,
    borderRadius: 30,
  },
  dishInfo: {
    padding: 20,
  },
  dishName: {
    fontSize: sizes.title,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 10,
  },
  dishPrice: {
    fontSize: sizes.h3,
    color: colors.gray,
    marginBottom: 10,
  },
  storeName: {
    fontSize: sizes.h3,
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  noteLabel: {
    fontSize: sizes.h3,
    marginBottom: 5,
    paddingHorizontal: 20,
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
    marginBottom: 20,
  },
  addButton: {
    backgroundColor: colors.green,
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: sizes.h3,
    color: '#fff',
    fontWeight: 'bold',
  },
});
