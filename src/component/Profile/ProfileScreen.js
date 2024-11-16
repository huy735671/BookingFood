import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  TextInput,
  Platform,
  ScrollView,
  Modal,
} from 'react-native';
import Icons from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {colors} from '../../constants/theme';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import auth from '@react-native-firebase/auth';

const ProfileScreen = () => {
  const [avatar, setAvatar] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState(null);
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');
  const [travelHobby, setTravelHobby] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showGenderModal, setShowGenderModal] = useState(false);

  // Fetch user data from Firebase Firestore
  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth().currentUser;
      if (user) {
        const userDoc = await firestore()
          .collection('users')
          .doc(user.email) // Use logged-in user's email
          .get();
  
        const userData = userDoc.data();
        if (userData) {
          setAvatar(userData.avatarUrl || null);
          setUsername(userData.fullName);
          setEmail(userData.email);
          setPhone(userData.phoneNumber);
          setDateOfBirth(userData.dateOfBirth?.toDate() || null);
          setGender(userData.gender || '');
          setBio(userData.bio || '');
          setTravelHobby(userData.travelHobby || '');
        }
      }
    };
  
    fetchUserProfile();
  }, []);
  

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || dateOfBirth;
    setShowDatePicker(Platform.OS === 'ios');
    setDateOfBirth(currentDate);
  };

  const handleChooseAvatar = () => {
    launchImageLibrary({mediaType: 'photo', quality: 1}, async response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const sourceUri = response.assets[0].uri; // Đường dẫn ảnh từ thư viện
  
        // Tạo tên file duy nhất cho ảnh
        const fileName = `avatars/${auth().currentUser.uid}/${Date.now()}.jpg`;
        const reference = storage().ref(fileName); // Tham chiếu đến Firebase Storage
  
        try {
          // Upload file lên Firebase Storage
          const uploadTask = reference.putFile(sourceUri); // Đẩy ảnh lên Storage
          await uploadTask; // Đợi upload hoàn thành
  
          // Lấy URL của ảnh đã được upload
          const imageUrl = await reference.getDownloadURL();
  
          // Cập nhật URL ảnh lên Firestore
          const user = auth().currentUser;
          if (user) {
            await firestore()
              .collection('users')
              .doc(user.email)
              .update({ avatarUrl: imageUrl });
          }
  
          // Cập nhật avatar trong ứng dụng
          setAvatar(imageUrl);
        } catch (error) {
          console.log('Upload failed', error); // Nếu có lỗi
        }
      }
    });
  };
  

  const handleSaveProfile = async () => {
    const user = auth().currentUser;
    if (user) {
      await firestore().collection('users').doc(user.email).update({
        fullName: username,
        phoneNumber: phone,
        dateOfBirth: dateOfBirth,
        gender: gender,
        bio: bio,
        travelHobby: travelHobby,
        avatarUrl: avatar,
      });
    }
  };

  const handleGenderSelect = selectedGender => {
    setGender(selectedGender);
    setShowGenderModal(false);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        {avatar ? (
          <Image source={{uri: avatar}} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Icons name="person" size={80} color="#999" />
          </View>
        )}
        <TouchableOpacity
          style={styles.cameraIcon}
          onPress={handleChooseAvatar}>
          <Icons name="camera-alt" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.bodyContainer}>
        <Text style={styles.headerText}>Thông tin cá nhân</Text>

        <Text style={styles.label}>Họ và tên</Text>
        <TextInput
          style={styles.input}
          value={username}
          onChangeText={setUsername}
          placeholder="Nhập họ và tên"
        />

        <Text style={styles.label}>Email</Text>
        <TextInput
          style={[styles.input, styles.disabledInput]}
          value={email}
          editable={false}
        />

        <Text style={styles.label}>Số điện thoại</Text>
        <TextInput
          style={styles.input}
          value={phone}
          onChangeText={setPhone}
          placeholder="Nhập số điện thoại"
        />

        <Text style={styles.label}>Ngày sinh</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(true)}>
          <TextInput
            style={styles.input}
            value={
              dateOfBirth
                ? dateOfBirth.toLocaleDateString('vi-VN')
                : 'dd/mm/yyyy'
            }
            editable={false}
          />
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={dateOfBirth || new Date()}
            mode="date"
            display="default"
            onChange={onDateChange}
          />
        )}

        <Text style={styles.label}>Giới tính</Text>
        <TouchableOpacity
          style={styles.genderSelector}
          onPress={() => setShowGenderModal(true)}>
          <Text style={styles.genderText}>
            {gender === '' ? 'Chọn giới tính' : gender}
          </Text>
        </TouchableOpacity>

        <Modal
          transparent={true}
          visible={showGenderModal}
          animationType="slide"
          onRequestClose={() => setShowGenderModal(false)}>
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <TouchableOpacity
                style={styles.modalCloseIcon}
                onPress={() => setShowGenderModal(false)}>
                <Icons name="close" size={24} color="#000" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Chọn giới tính</Text>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleGenderSelect('Nam')}>
                <Text style={styles.modalItemText}>Nam</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleGenderSelect('Nữ')}>
                <Text style={styles.modalItemText}>Nữ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalItem}
                onPress={() => handleGenderSelect('Khác')}>
                <Text style={styles.modalItemText}>Khác</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <View style={styles.additionalInfoContainer}>
          <Text style={styles.additionalInfoTitle}>Thông tin bổ sung</Text>

          <Text style={styles.label}>Tiểu sử</Text>
          <TextInput
            style={[styles.input, styles.largeInput]}
            value={bio}
            onChangeText={setBio}
            placeholder="Giới thiệu ngắn về bản thân"
            multiline={true}
          />

          <Text style={styles.label}>Sở thích du lịch</Text>
          <TextInput
            style={[styles.input, styles.largeInput]}
            value={travelHobby}
            onChangeText={setTravelHobby}
            placeholder="Ví dụ: Khám phá ẩm thực, leo núi, tham quan di tích lịch sử"
            multiline={true}
          />
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSaveProfile}>
          <Text style={styles.saveButtonText}>Lưu thay đổi</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  avatarPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cameraIcon: {
    position: 'absolute',
    right: 125,
    bottom: 0,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 5,
  },
  bodyContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 2},
    elevation: 5,
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  disabledInput: {
    backgroundColor: '#eaeaea',
  },
  largeInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  genderSelector: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 15,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
  },
  genderText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontSize: 16,
    textAlign: 'center',
  },
  modalCloseIcon: {
    position: 'absolute',
    top: 10,
    right: 10,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});
