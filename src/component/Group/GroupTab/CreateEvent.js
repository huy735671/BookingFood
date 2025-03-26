import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Platform,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors, sizes} from '../../../constants/theme';
import Icon from '../../Icon';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';

const CreateEvent = () => {
  const route = useRoute();
  const {groupId} = route.params || {};
  const navigation = useNavigation();
  const [eventType, setEventType] = useState('Dọn dẹp');
  const [eventName, setEventName] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState('');
  const [coverImage, setCoverImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin người dùng hiện tại
    const user = auth().currentUser;
    if (user) {
      // Lấy thông tin chi tiết từ collection users
      firestore()
        .collection('users')
        .doc(user.email)
        .get()
        .then(documentSnapshot => {
          if (documentSnapshot.exists) {
            setCurrentUser({
              email: user.email,
              fullName: documentSnapshot.data().fullName,
              ...documentSnapshot.data(),
            });
          } else {
            setCurrentUser({
              email: user.email,
              fullName: user.displayName || 'Người dùng',
            });
          }
        })
        .catch(error => {
          console.error('Error getting user data:', error);
          setCurrentUser({
            email: user.email,
            fullName: user.displayName || 'Người dùng',
          });
        });
    }
  }, []);


  // Hàm xử lý thêm vật dụng mới
  const handleAddItem = () => {
    if (newItem.trim() !== '') {
      setItems([...items, newItem.trim()]);
      setNewItem('');
    }
  };

  // Hàm xử lý xóa vật dụng
  const handleRemoveItem = (index) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // Hàm hiển thị lựa chọn chụp hoặc chọn ảnh
  const showImageOptions = () => {
    Alert.alert(
      'Thêm ảnh bìa',
      'Chọn phương thức',
      [
        {
          text: 'Chụp ảnh',
          onPress: takePhoto,
        },
        {
          text: 'Chọn từ thư viện',
          onPress: chooseFromLibrary,
        },
        {
          text: 'Hủy',
          style: 'cancel',
        },
      ],
      {cancelable: true},
    );
  };

  // Hàm chụp ảnh mới
  const takePhoto = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      saveToPhotos: true,
    };

    launchCamera(options, response => {
      handleImageResponse(response);
    });
  };

  // Hàm chọn ảnh từ thư viện
  const chooseFromLibrary = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
    };

    launchImageLibrary(options, response => {
      handleImageResponse(response);
    });
  };

  // Hàm xử lý response từ image picker
  const handleImageResponse = (response) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.errorCode) {
      console.log('ImagePicker Error: ', response.errorMessage);
      Alert.alert('Lỗi', 'Không thể tải ảnh lên. Vui lòng thử lại.');
    } else if (response.assets && response.assets.length > 0) {
      setCoverImage(response.assets[0]);
    }
  };

  // Hàm upload ảnh lên Firebase Storage
  const uploadImage = async (imageUri) => {
    if (!imageUri) return null;
    
    try {
      // Tạo tên file duy nhất
      const fileName = `event_images/${Date.now()}_${Math.random().toString(36).substring(7)}`;
      const reference = storage().ref(fileName);
      
      // Upload ảnh
      await reference.putFile(imageUri);
      
      // Lấy URL download
      const url = await reference.getDownloadURL();
      return url;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };


  

  const generateRandomCode = () => {
    const length = Math.floor(Math.random() * 3) + 8; // Random độ dài từ 8 đến 10
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    for (let i = 0; i < length; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return code;
  };
  
  const handleCreateEvent = async () => {
    if (!eventName.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên sự kiện');
      return;
    }
  
    if (!location.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập địa điểm tổ chức');
      return;
    }
  
    if (!currentUser) {
      Alert.alert('Thông báo', 'Bạn cần đăng nhập để tạo sự kiện');
      return;
    }
  
    try {
      setIsLoading(true);
  
      // Upload ảnh nếu có
      let coverImageUrl = null;
      if (coverImage) {
        coverImageUrl = await uploadImage(coverImage.uri);
      }
  
      // Tạo mã xác nhận ngẫu nhiên
      const confirmationCode = generateRandomCode();
  
      // Tạo đối tượng sự kiện để lưu vào Firestore
      const eventData = {
        eventType,
        eventName,
        description,
        date: firestore.Timestamp.fromDate(date),
        startTime: firestore.Timestamp.fromDate(startTime),
        endTime: firestore.Timestamp.fromDate(endTime),
        location,
        items,
        coverImageUrl,
        groupId,
        createdBy: {
          email: currentUser.email,
          fullName: currentUser.fullName,
        },
        createdAt: firestore.FieldValue.serverTimestamp(),
        participants: [],
        status: 'active',
        confirmationCode, // Thêm mã xác nhận vào Firestore
      };
  
      // Lưu vào collection EVENTS_GROUPS
      await firestore().collection('EVENTS_GROUPS').add(eventData);
  
      setIsLoading(false);
      Alert.alert('Thành công', `Sự kiện đã được tạo!\nMã xác nhận: ${confirmationCode}`, [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (error) {
      setIsLoading(false);
      console.error('Error creating event:', error);
      Alert.alert('Lỗi', 'Không thể tạo sự kiện. Vui lòng thử lại sau.');
    }
  };

  return (
    <ScrollView style={styles.bodycontainer}>
      <TouchableOpacity 
        style={[styles.imageUpload, coverImage && styles.imageUploaded]} 
        onPress={showImageOptions}
      >
        {coverImage ? (
          <Image
            source={{uri: coverImage.uri}}
            style={styles.uploadedImage}
          />
        ) : (
          <Text style={styles.imageText}>📷 Thêm ảnh bìa</Text>
        )}
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.titleText}>Loại sự kiện</Text>
        <View style={styles.eventTypeContainer}>
          <TouchableOpacity
            style={[
              styles.eventType,
              eventType === 'Dọn dẹp' && styles.selected,
            ]}
            onPress={() => setEventType('Dọn dẹp')}>
            <Icon icon="trash" size={20} color="#4caf50" />
            <Text style={styles.eventTypeText}>Dọn dẹp</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.eventType,
              eventType === 'Workshop' && styles.selected,
            ]}
            onPress={() => setEventType('Workshop')}>
            <Icon icon="people" size={20} color="#4caf50" />
            <Text style={styles.eventTypeText}> Workshop</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.titleText}>Tên sự kiện</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên sự kiện..."
          value={eventName}
          onChangeText={setEventName}
        />

        <Text style={styles.titleText}>Mô tả</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Mô tả chi tiết về sự kiện..."
          value={description}
          onChangeText={setDescription}
          multiline
        />

        <Text style={styles.titleText}>Ngày</Text>
        <TouchableOpacity
          onPress={() => setShowDatePicker(true)}
          style={styles.input}>
          <Text>{date.toLocaleDateString()}</Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowDatePicker(false);
              if (selectedDate) setDate(selectedDate);
            }}
          />
        )}

        <Text style={styles.titleText}>Thời gian</Text>
        <View style={styles.timeContainer}>
          <TouchableOpacity
            onPress={() => setShowStartTimePicker(true)}
            style={styles.timeInput}>
            <Text>{startTime.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showStartTimePicker && (
            <DateTimePicker
              value={startTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowStartTimePicker(false);
                if (selectedTime) setStartTime(selectedTime);
              }}
            />
          )}

          <Text style={styles.toText}>đến</Text>

          <TouchableOpacity
            onPress={() => setShowEndTimePicker(true)}
            style={styles.timeInput}>
            <Text>{endTime.toLocaleTimeString()}</Text>
          </TouchableOpacity>
          {showEndTimePicker && (
            <DateTimePicker
              value={endTime}
              mode="time"
              display="default"
              onChange={(event, selectedTime) => {
                setShowEndTimePicker(false);
                if (selectedTime) setEndTime(selectedTime);
              }}
            />
          )}
        </View>
        

        <Text style={styles.titleText}>Địa điểm</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập địa điểm tổ chức..."
          value={location}
          onChangeText={setLocation}
        />

        {/* Phần Vật dụng cần mang theo */}
        <Text style={styles.titleText}>Vật dụng cần mang theo</Text>
        <View style={styles.itemsContainer}>
          {items.map((item, index) => (
            <View key={index} style={styles.itemChip}>
              <Text style={styles.itemText}>{item}</Text>
              <TouchableOpacity onPress={() => handleRemoveItem(index)}>
                <Text style={styles.removeIcon}>×</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View style={styles.addItemContainer}>
          <TextInput
            style={[styles.input, styles.itemInput]}
            placeholder="Thêm vật dụng..."
            value={newItem}
            onChangeText={setNewItem}
          />
          <TouchableOpacity style={styles.addButton} onPress={handleAddItem}>
            <Text style={styles.addButtonText}>+ Thêm</Text>
          </TouchableOpacity>
        </View>

        {/* Mẹo tạo sự kiện thành công */}
        <View style={styles.tipContainer}>
          <View style={styles.tipIconContainer}>
            <Icon icon="info" size={20} color="#4caf50" />
          </View>
          <View style={styles.tipTextContainer}>
            <Text style={styles.tipTitle}>Mẹo tạo sự kiện thành công</Text>
            <Text style={styles.tipDescription}>
              Cung cấp thông tin chi tiết về sự kiện, thời gian và địa điểm cụ thể sẽ giúp thu hút nhiều người tham gia hơn.
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.createButton, isLoading && styles.disabledButton]}
          onPress={handleCreateEvent}
          disabled={isLoading}>
          <Text style={styles.createText}>
            {isLoading ? 'Đang tạo...' : 'Tạo sự kiện'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bodycontainer: {
    flex: 1,
  },
  container: {
    padding: 10,
    backgroundColor: '#F8F8F8',
  },
  titleText: {
    fontWeight: 'bold',
    fontSize: sizes.body,
    marginVertical: 10,
    color: colors.primary,
  },
  imageUpload: {
    height: 200,
    backgroundColor: '#D9D9D9',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
  },
  imageUploaded: {
    padding: 0,
    overflow: 'hidden',
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  imageText: {
    color: '#555'
  },
  eventTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  eventType: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#CCC',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  selected: {borderColor: 'green', backgroundColor: '#DFF0D8'},
  eventTypeText: {fontSize: 16},
  input: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 10,
  },
  textArea: {height: 80},
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  timeInput: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#DDD',
    marginBottom: 10,
    flex: 2, // Chiếm nhiều không gian hơn
  },
  toText: {
    fontSize: 16,
    marginHorizontal: 10, // Thêm margin để tạo khoảng cách
    flex: 0.5, // Chiếm ít không gian hơn
  },
  createButton: {
    backgroundColor: 'green',
    padding: 15,
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#8bc34a',
    opacity: 0.7,
  },
  createText: {color: '#FFF', fontSize: 16, fontWeight: 'bold'},
  
  // Styles cho phần vật dụng
  itemsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  itemChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginRight: 8,
    marginBottom: 8,
  },
  itemText: {
    marginRight: 5,
  },
  removeIcon: {
    fontSize: 18,
    color: '#888',
  },
  addItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  itemInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 10,
  },
  addButton: {
    backgroundColor: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#4caf50',
  },
  addButtonText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  
  // Styles cho phần mẹo
  tipContainer: {
    flexDirection: 'row',
    backgroundColor: '#e8f5e9',
    borderRadius: 5,
    padding: 15,
    marginVertical: 10,
  },
  tipIconContainer: {
    marginRight: 10,
  },
  tipTextContainer: {
    flex: 1,
  },
  tipTitle: {
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
  },
  tipDescription: {
    color: '#2e7d32',
    fontSize: 14,
  },
});

export default CreateEvent;