import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import {launchImageLibrary} from 'react-native-image-picker';
import Icon from '../Icon';
import auth from '@react-native-firebase/auth';

const CreateGroupScreen = ({navigation}) => {
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupGoal, setGroupGoal] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [groupImage, setGroupImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const categories = [
    'Dọn dẹp bãi biển',
    'Bảo vệ rừng',
    'Làm sạch sông hồ',
    'Xanh hóa đô thị',
    'Tái chế',
    'Giáo dục môi trường',
    'Khác',
  ];

  const handleSelectImage = async () => {
    const result = await launchImageLibrary({mediaType: 'photo'});

    if (result.didCancel) return;
    if (result.assets && result.assets.length > 0) {
      setGroupImage(result.assets[0].uri);
    }
  };

  const uploadImageToFirebase = async imageUri => {
    if (!imageUri) return null;

    const filename = `group_images/${Date.now()}.jpg`;
    const reference = storage().ref(filename);

    try {
      await reference.putFile(imageUri);
      return await reference.getDownloadURL();
    } catch (error) {
      console.error('Lỗi khi tải ảnh lên Firebase:', error);
      return null;
    }
  };

  const handleSubmit = async () => {
    if (!groupName || !groupDescription || !groupGoal || !location) {
      Alert.alert('Lỗi', 'Vui lòng nhập đầy đủ thông tin nhóm.');
      return;
    }
  
    setUploading(true);
  
    const user = auth().currentUser;
    if (!user) {
      Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
      setUploading(false);
      return;
    }
  
    try {
      // Lấy thông tin người dùng từ Firestore
      const userDoc = await firestore().collection('users').doc(user.email).get();
  
      if (!userDoc.exists) {
        Alert.alert('Lỗi', 'Không tìm thấy thông tin người dùng.');
        setUploading(false);
        return;
      }
  
      const { fullName, email, phoneNumber } = userDoc.data();
  
      // Upload ảnh (nếu có)
      const imageUrl = await uploadImageToFirebase(groupImage);
  
      // Dữ liệu nhóm
      const newGroup = {
        groupName,
        groupDescription,
        groupGoal,
        location,
        category: category === 'Khác' ? customCategory : category,
        groupImage: imageUrl || '',
        status: 'pending',
        createdAt: firestore.FieldValue.serverTimestamp(),
        createdBy: {
          fullName,
          email,
          phoneNumber,
        },
      };
  
      // Lưu vào Firestore
      await firestore().collection('GROUPS').add(newGroup);
      Alert.alert('Thành công', 'Nhóm của bạn đã được gửi xét duyệt.');
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi lưu nhóm:', error);
      Alert.alert('Lỗi', 'Không thể gửi yêu cầu. Vui lòng thử lại.');
    } finally {
      setUploading(false);
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.formContainer}>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionHeaderText}>Thông tin cơ bản</Text>

          <Text style={styles.fieldLabel}>Ảnh đại diện nhóm</Text>
          <TouchableOpacity
            style={styles.uploadImageContainer}
            onPress={handleSelectImage}>
            {groupImage ? (
              <Image source={{uri: groupImage}} style={styles.groupImage} />
            ) : (
              <View style={styles.placeholderImageContainer}>
                <Text style={styles.cameraIconText}>📷</Text>
                <Text style={styles.uploadText}>Nhấn để tải ảnh lên</Text>
              </View>
            )}
          </TouchableOpacity>

          <Text style={styles.fieldLabel}>Tên nhóm</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên nhóm..."
            value={groupName}
            onChangeText={setGroupName}
          />

          <Text style={styles.fieldLabel}>Danh mục</Text>
          <View style={styles.pickerContainer}>
            <Picker
              selectedValue={category}
              onValueChange={itemValue => setCategory(itemValue)}
              style={styles.picker}>
              {categories.map((item, index) => (
                <Picker.Item key={index} label={item} value={item} />
              ))}
            </Picker>
          </View>

          {category === 'Khác' && (
            <TextInput
              style={styles.input}
              placeholder="Nhập danh mục khác..."
              value={customCategory}
              onChangeText={setCustomCategory}
            />
          )}

          <Text style={styles.fieldLabel}>Địa điểm hoạt động</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập địa điểm hoạt động..."
            value={location}
            onChangeText={setLocation}
          />

          <Text style={styles.fieldLabel}>Mô tả</Text>
          <TextInput
            style={styles.textAreaInput}
            placeholder="Mô tả ngắn gọn về nhóm để thu hút thành viên tham gia"
            multiline
            value={groupDescription}
            onChangeText={setGroupDescription}
          />

          <Text style={styles.fieldLabel}>Mục tiêu của nhóm</Text>
          <TextInput
            style={styles.textAreaInput}
            placeholder="Mục tiêu cụ thể mà nhóm muốn đạt được"
            multiline
            value={groupGoal}
            onChangeText={setGroupGoal}
          />
        </View>
        <View style={styles.approvalContainer}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon icon="info" size={15} color="#388E3C" />
            <Text style={styles.approvalTitle}>Quy trình phê duyệt</Text>
          </View>

          <Text style={styles.approvalText}>
            Nhóm của bạn sẽ được kiểm duyệt trước khi xuất hiện công khai trên
            ứng dụng. Quá trình này có thể mất 1-3 ngày làm việc.
          </Text>
        </View>

        <TouchableOpacity style={styles.previewButton}>
          <Text style={styles.previewButtonText}>
            👁 Xem trước thông tin nhóm
          </Text>
        </TouchableOpacity>
      </ScrollView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={handleSubmit}
          disabled={uploading}>
          <Text style={styles.submitButtonText}>
            {uploading ? 'Đang gửi...' : 'Gửi yêu cầu'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  formContainer: {
    flex: 1,
  },
  sectionContainer: {
    padding: 16,
    backgroundColor: '#F9F9F9',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  uploadImageContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 8,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  placeholderImageContainer: {
    alignItems: 'center',
  },
  cameraIconText: {
    fontSize: 48,
    color: '#777',
  },
  uploadText: {
    marginTop: 8,
    color: '#4CAF50',
    fontWeight: '500',
  },
  groupImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    padding: 12,
    backgroundColor: 'white',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    backgroundColor: 'white',
  },
  textAreaInput: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 4,
    padding: 12,
    backgroundColor: 'white',
    height: 100,
    textAlignVertical: 'top',
  },
  buttonContainer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    padding: 12,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },

  approvalContainer: {
    marginHorizontal:16,
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    borderWidth: 1,
    borderColor: '#C8E6C9',
  },
  approvalTitle: {
    fontWeight: 'bold',
    color: '#388E3C',
    marginBottom: 4,
    marginLeft: 10,
  },
  approvalText: {
    color: '#2E7D32',
    fontSize: 14,
    marginBottom: 8,
    marginLeft: 25,
  },
  previewButton: {
    marginHorizontal:16,
    marginVertical:10,
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 6,
    padding: 8,
    alignItems: 'center',
  },
  previewButtonText: {
    color: '#388E3C',
    fontWeight: '500',
  },
});

export default CreateGroupScreen;
