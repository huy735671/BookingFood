import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import {launchImageLibrary} from 'react-native-image-picker';
import {Picker} from '@react-native-picker/picker';
import storage from '@react-native-firebase/storage';
import { colors } from '../../../../constants/theme';

const CreateGiftScreen = () => {
  const [giftName, setGiftName] = useState('');
  const [giftDescription, setGiftDescription] = useState('');
  const [giftPoints, setGiftPoints] = useState('');
  const [giftCategory, setGiftCategory] = useState('Sản phẩm eco');
  const [giftQuantity, setGiftQuantity] = useState('');
  const navigation = useNavigation();
  const [image, setImage] = useState(null);
  const [deliveryTime, setDeliveryTime] = useState('');
  const [expirationDate, setExpirationDate] = useState('');
  const [randomCode, setRandomCode] = useState('');

  // Function to generate a random code
  const generateRandomCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'ECO'; // First 3 characters always 'ECO'
    for (let i = 3; i < 10; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const pickImage = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, response => {
      if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const addGift = async () => {
    if (!giftName || !giftDescription || !giftPoints) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin quà tặng.');
      return;
    }
  
    let imageUrl = null;
  
    if (image) {
      const fileName = `gifts/${Date.now()}.jpg`; // Tạo tên file duy nhất
      const reference = storage().ref(fileName);
  
      try {
        await reference.putFile(image); // Tải ảnh lên Storage
        imageUrl = await reference.getDownloadURL(); // Lấy URL ảnh
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể tải ảnh lên, vui lòng thử lại.');
        return;
      }
    }
  
    try {
      // Generate random code for Voucher and Trải nghiệm categories
      const code = ['Voucher', 'Trải nghiệm'].includes(giftCategory) 
        ? generateRandomCode() 
        : null;

      await firestore().collection('GIFTS').add({
        name: giftName,
        description: giftDescription,
        points: parseInt(giftPoints),
        category: giftCategory,
        quantity: giftQuantity ? parseInt(giftQuantity) : null,
        deliveryTime: giftCategory === 'Quyên góp' ? null : deliveryTime,
        expirationDate: giftCategory === 'Quyên góp' ? null : expirationDate,
        randomCode: code,
        image: imageUrl,
      });
  
      Alert.alert('Thành công', 'Quà tặng đã được thêm.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể thêm quà tặng. Vui lòng thử lại.');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Hình ảnh phần thưởng *</Text>
      <View style={styles.imageContainer}>
        <TouchableOpacity style={styles.imageWrapper} onPress={pickImage}>
          {image ? (
            <Image source={{uri: image}} style={styles.image} />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Text style={styles.uploadText}>Tải lên</Text>
            </View>
          )}
        </TouchableOpacity>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          <Text>Chọn hình ảnh</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.label}>Tên phần thưởng *</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập tên phần thưởng"
        value={giftName}
        onChangeText={setGiftName}
      />
      <Text style={styles.label}>Mô tả *</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Mô tả chi tiết về phần thưởng"
        multiline
        value={giftDescription}
        onChangeText={setGiftDescription}
      />
      <View style={styles.point}>
        <View style={styles.pointItem}>
          <Text style={styles.label}>Số điểm *</Text>
          <TextInput
            style={styles.inputRow}
            placeholder="Nhập số điểm"
            keyboardType="numeric"
            value={giftPoints}
            onChangeText={setGiftPoints}
          />
        </View>
        <View style={styles.pointItem}>
          <Text style={styles.label}>Danh mục *</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={giftCategory}
              onValueChange={itemValue => {
                setGiftCategory(itemValue);
                // Reset conditional fields when category changes
                setDeliveryTime('');
                setExpirationDate('');
              }}
              style={styles.picker}>
              <Picker.Item label="Sản phẩm eco" value="Sản phẩm eco" />
              <Picker.Item label="Voucher" value="Voucher" />
              <Picker.Item label="Trải nghiệm" value="Trải nghiệm" />
              <Picker.Item label="Quyên góp" value="Quyên góp" />
            </Picker>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>Thông tin bổ sung</Text>
      <Text style={styles.label}>Số lượng</Text>
      <TextInput
        style={styles.input}
        placeholder="Nhập số lượng"
        keyboardType="numeric"
        value={giftQuantity}
        onChangeText={setGiftQuantity}
      />

      {/* Conditional rendering for delivery time */}
      {giftCategory !== 'Quyên góp' && giftCategory !== 'Voucher' && giftCategory !== 'Trải nghiệm' && (
        <>
          <Text style={styles.label}>Thời gian giao hàng</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: từ 3-5 ngày"
            value={deliveryTime}
            onChangeText={setDeliveryTime}
          />
        </>
      )}

      {/* Conditional rendering for random code */}
      {(giftCategory === 'Voucher' || giftCategory === 'Trải nghiệm') && (
        <View style={styles.randomCodeContainer}>
          <Text style={styles.label}>Mã ngẫu nhiên</Text>
          <View style={styles.randomCodeInputContainer}>
            <TextInput
              style={styles.randomCodeInput}
              placeholder="Mã ngẫu nhiên sẽ được tạo"
              value={randomCode}
              editable={false}
            />
            <TouchableOpacity 
              style={styles.generateCodeButton} 
              onPress={() => setRandomCode(generateRandomCode())}
            >
              <Text style={styles.generateCodeButtonText}>Tạo mã</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Conditional rendering for expiration date */}
      {giftCategory !== 'Quyên góp' && (
        <>
          <Text style={styles.label}>Hạn sử dụng</Text>
          <TextInput
            style={styles.input}
            placeholder="Ví dụ: 30 ngày kể từ ngày đổi"
            value={expirationDate}
            onChangeText={setExpirationDate}
          />
        </>
      )}

      <TouchableOpacity style={styles.saveButton} onPress={addGift}>
        <Text style={styles.saveButtonText}>Lưu</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8faf5',
  },

  label: {fontSize: 16, fontWeight: 'bold', marginBottom: 5},
  imageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  imageWrapper: {
    width: 100,
    height: 100,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  uploadPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  uploadText: {color: '#999'},
  image: {width: '100%', height: '100%', borderRadius: 10},
  imagePicker: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
  point: {
    flexDirection: 'row',
    gap: 10, // Tạo khoảng cách giữa hai ô
  },
  pointItem: {
    flex: 1, // Giúp mỗi ô mở rộng đều ra
  },
  inputRow: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    width: '100%',
  },
  textArea: {height: 80},
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
  saveButtonText: {color: 'white', fontSize: 16, fontWeight: 'bold'},
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  generateCodeButton: {
    backgroundColor: '#17a2b8',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 15,
  },
  generateCodeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  randomCodeContainer: {
    marginBottom: 15,
  },
  randomCodeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  randomCodeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#ffffff',
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
  generateCodeButton: {
    backgroundColor: colors.green,
    padding: 8,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height:50,
  },
  generateCodeButtonText: {
    color: 'white',
    fontSize: 12,
  },
});

export default CreateGiftScreen;
