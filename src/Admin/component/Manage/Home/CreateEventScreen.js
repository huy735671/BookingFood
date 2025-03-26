import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import { Alert } from 'react-native';
import { useNavigation ,useRoute } from '@react-navigation/native';


const CreateEventScreen = () => {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [location, setLocation] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [maxParticipants, setMaxParticipants] = useState('');
  const [eventType, setEventType] = useState('');
  const [itemsToBring, setItemsToBring] = useState('');
  const [eventSchedule, setEventSchedule] = useState('');
  const [completionPoints, setCompletionPoints] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [organizer, setOrganizer] = useState('');
  const [customEventType, setCustomEventType] = useState('');

  const navigation = useNavigation();

  const route = useRoute();
  const eventData = route.params?.event;

  useEffect(() => {
    if (eventData) {
      setEventName(eventData.eventName || '');
      setEventDate(eventData.eventDate ? new Date(eventData.eventDate) : new Date());
      setStartTime(eventData.startTime ? new Date(eventData.startTime) : new Date());
      setEndTime(eventData.endTime ? new Date(eventData.endTime) : new Date());
      setLocation(eventData.location || '');
      setDescription(eventData.description || '');
      setImage(eventData.image || null);
      setMaxParticipants(eventData.maxParticipants ? eventData.maxParticipants.toString() : '');
      setEventType(eventData.eventType || '');
      setItemsToBring(eventData.itemsToBring || '');
      setEventSchedule(eventData.eventSchedule || '');
      setCompletionPoints(eventData.completionPoints ? eventData.completionPoints.toString() : '');
      setConfirmationCode(eventData.confirmationCode || generateConfirmationCode());
      setOrganizer(eventData.organizer || '');
      setCustomEventType(eventData.eventType === 'Khác' ? eventData.customEventType : '');
    }
  }, [eventData]);
  
  const saveEventToFirestore = async () => {
    if (!eventName || !location || !description) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin');
      return;
    }

    try {
      let imageUrl = image;

      if (image && !image.startsWith('https')) { // Nếu ảnh mới được chọn
        const imageRef = storage().ref(`events/${Date.now()}.jpg`);
        await imageRef.putFile(image);
        imageUrl = await imageRef.getDownloadURL();
      }

      if (eventData?.id) {
        // Cập nhật sự kiện nếu có ID
        await firestore().collection('EVENTS').doc(eventData.id).update({
          eventName,
          eventDate: eventDate.toISOString(),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          location,
          description,
          image: imageUrl,
          maxParticipants: parseInt(maxParticipants) || 0,
          eventType: eventType === 'Khác' ? customEventType : eventType,
          itemsToBring,
          eventSchedule,
          completionPoints: parseInt(completionPoints) || 0,
          confirmationCode,
          organizer,
        });
      } else {
        // Tạo sự kiện mới nếu không có ID
        await firestore().collection('EVENTS').add({
          eventName,
          eventDate: eventDate.toISOString(),
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          location,
          description,
          image: imageUrl,
          maxParticipants: parseInt(maxParticipants) || 0,
          eventType: eventType === 'Khác' ? customEventType : eventType,
          itemsToBring,
          eventSchedule,
          completionPoints: parseInt(completionPoints) || 0,
          confirmationCode,
          organizer,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      }

      Alert.alert('Thành công', 'Sự kiện đã được lưu!');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi lưu sự kiện:', error);
      Alert.alert('Lỗi', 'Không thể lưu sự kiện, vui lòng thử lại.');
    }
  };

  
  const pickImage = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
  
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('Người dùng đã hủy chọn ảnh');
      } else if (response.errorMessage) {
        console.log('Lỗi chọn ảnh:', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        setImage(response.assets[0].uri);
      }
    });
  };

  const generateConfirmationCode = () => {
    return Math.random().toString(36).substring(2, 10).toUpperCase();
  };

  // Gọi hàm tạo mã xác nhận khi tạo sự kiện
  useEffect(() => {
    // Chỉ tạo mã xác nhận mới nếu đang tạo sự kiện mới (không có eventData)
    if (!eventData) {
      setConfirmationCode(generateConfirmationCode());
    }
  }, []);
  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

        <Text style={styles.label}>Tên sự kiện</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên sự kiện"
          value={eventName}
          onChangeText={setEventName}
        />

        <Text style={styles.label}>Ngày diễn ra</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => setShowDatePicker(true)}>
          <Icon name="event" size={20} color="#777" />
          <Text style={styles.text}>
            {eventDate.toLocaleDateString('vi-VN')}
          </Text>
        </TouchableOpacity>

        {showDatePicker && (
          <DateTimePicker
            value={eventDate}
            mode="date"
            display="default"
            onChange={(event, date) => {
              setShowDatePicker(false);
              if (date) setEventDate(date);
            }}
          />
        )}

        {/* Thời gian */}
        <Text style={styles.label}>Thời gian</Text>
        <View style={styles.timeContainer}>
          <TouchableOpacity
            style={styles.inputTime}
            onPress={() => setShowStartTimePicker(true)}>
            <Icon name="access-time" size={20} color="#777" />
            <Text style={styles.text}>
              {startTime.toLocaleTimeString('vi-VN')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.inputTime}
            onPress={() => setShowEndTimePicker(true)}>
            <Icon name="access-time" size={20} color="#777" />
            <Text style={styles.text}>
              {endTime.toLocaleTimeString('vi-VN')}
            </Text>
          </TouchableOpacity>
        </View>

        {showStartTimePicker && (
          <DateTimePicker
            value={startTime}
            mode="time"
            display="default"
            onChange={(event, date) => {
              setShowStartTimePicker(false);
              if (date) setStartTime(date);
            }}
          />
        )}

        {showEndTimePicker && (
          <DateTimePicker
            value={endTime}
            mode="time"
            display="default"
            onChange={(event, date) => {
              setShowEndTimePicker(false);
              if (date) setEndTime(date);
            }}
          />
        )}

        {/* Địa điểm */}
        <Text style={styles.label}>Địa điểm</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập địa điểm sự kiện"
          value={location}
          onChangeText={setLocation}
        />
      </View>
      <View style={styles.form}>
        {/* Hình ảnh sự kiện */}
        <Text style={styles.sectionTitle}>Hình ảnh sự kiện</Text>
        <TouchableOpacity style={styles.imageUpload} onPress={pickImage}>
          <Icon name="cloud-upload" size={30} color="#777" />
          <Text style={styles.uploadText}>
            Kéo thả hình ảnh hoặc nhấn để tải lên
          </Text>
          <Text style={styles.buttonText}>Chọn hình ảnh</Text>
        </TouchableOpacity>

        {image && <Image source={{uri: image}} style={styles.eventImage} />}
      </View>

      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Mô tả sự kiện</Text>
        <TextInput
          style={[styles.input, {height: 80, textAlignVertical: 'top'}]}
          placeholder="Mô tả chi tiết về sự kiện"
          multiline
          value={description}
          onChangeText={setDescription}
        />
      </View>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>

        <Text style={styles.label}>Số người tham gia tối đa</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số người"
          keyboardType="numeric"
          value={maxParticipants}
          onChangeText={setMaxParticipants}
        />

        <Text style={styles.label}>Loại sự kiện</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={eventType}
            onValueChange={itemValue => {
              setEventType(itemValue);
              if (itemValue !== 'Khác') {
                setCustomEventType(''); 
              }
            }}>
            <Picker.Item label="Dọn dẹp môi trường" value="Dọn dẹp môi trường" />
            <Picker.Item label="Hội thảo" value="Hội thảo" />
            <Picker.Item label="Trồng cây" value="Trồng cây" />
            <Picker.Item label="Tái chế" value="Tái chế" />
            <Picker.Item label="Khác" value="Khác" />
          </Picker>
        </View>

        {eventType === 'Khác' && (
          <TextInput
            style={styles.input}
            placeholder="Nhập loại sự kiện"
            value={customEventType}
            onChangeText={setCustomEventType}
          />
        )}

        <Text style={styles.label}>Vật dụng cần mang theo</Text>
        <TextInput
          style={[styles.input, {height: 80, textAlignVertical: 'top'}]}
          placeholder="Liệt kê các vật dụng người tham gia cần mang theo"
          multiline
          value={itemsToBring}
          onChangeText={setItemsToBring}
        />

        <Text style={styles.label}>Lịch trình sự kiện</Text>
        <TextInput
          style={[styles.input, {height: 80, textAlignVertical: 'top'}]}
          placeholder="Mô tả lịch trình chi tiết của sự kiện"
          multiline
          value={eventSchedule}
          onChangeText={setEventSchedule}
        />
      </View>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Hoàn thành sự kiện</Text>

        <Text style={styles.label}>Đơn vị tổ chức</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập đơn vị tổ chức"
          value={organizer}
          onChangeText={setOrganizer}
        />

        {/* Nhập điểm khi hoàn thành */}
        <Text style={styles.label}>Điểm khi hoàn thành</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập số điểm"
          keyboardType="numeric"
          value={completionPoints}
          onChangeText={setCompletionPoints}
        />

        {/* Hiển thị mã xác nhận hoàn thành */}
        <Text style={styles.label}>Mã xác nhận hoàn thành</Text>
        <View style={styles.codeBox}>
          <Text style={styles.codeText}>{confirmationCode}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.saveButton} onPress={saveEventToFirestore}>
  <Text style={styles.saveButtonText}>Lưu sự kiện</Text>
</TouchableOpacity>

    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  form: {
    padding: 20,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    margin: 15,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  inputTime: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 5,
    marginHorizontal: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    marginLeft: 10,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    color: '#333',
    marginTop: 10,
  },
  input: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 5,
  },
  inputTime: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 5,
    marginHorizontal: 5,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  text: {
    marginLeft: 10,
    color: '#333',
  },
  imageUpload: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 15,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  uploadText: {
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
  },
  buttonText: {
    color: '#2E7D32',
    fontWeight: 'bold',
    marginTop: 5,
  },
  eventImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginTop: 10,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 5,
  },
  codeBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginTop: 5,
    alignItems: 'center',
  },

  codeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  saveButton: {
    backgroundColor: '#2E7D32',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    margin: 20,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
};

export default CreateEventScreen;
