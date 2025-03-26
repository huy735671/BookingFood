import React, {useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';
import {colors} from '../constants/theme';

const ConfirmTaskScreen = ({route, navigation}) => {
  const {task} = route.params;
  const [beforeImage, setBeforeImage] = useState(null);
  const [afterImage, setAfterImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const selectBeforeImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          Alert.alert('Lỗi', 'Không thể chọn ảnh: ' + response.errorMessage);
          return;
        }

        if (response.assets && response.assets.length > 0) {
          setBeforeImage(response.assets[0].uri);
        }
      },
    );
  };

  const selectAfterImage = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        includeBase64: false,
      },
      response => {
        if (response.didCancel) {
          return;
        }

        if (response.errorCode) {
          Alert.alert('Lỗi', 'Không thể chọn ảnh: ' + response.errorMessage);
          return;
        }

        if (response.assets && response.assets.length > 0) {
          setAfterImage(response.assets[0].uri);
        }
      },
    );
  };

  const handleSubmit = async () => {
    if (!beforeImage || !afterImage) {
      Alert.alert('Lỗi', 'Vui lòng chọn đủ 2 hình ảnh để xác nhận nhiệm vụ.');
      return;
    }

    const user = auth().currentUser;
    if (!user) {
      Alert.alert('Lỗi', 'Bạn cần đăng nhập để hoàn thành nhiệm vụ.');
      return;
    }

    // Hiển thị loading
    setLoading(true);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    try {
      // Kiểm tra xem nhiệm vụ này đã được hoàn thành trong ngày hôm nay chưa
      const existingTaskSnapshot = await firestore()
        .collection('USER_TASKS')
        .where('email', '==', user.email)
        .where('taskId', '==', task.id)
        .where('completedDate', '==', todayStr)
        .get();

      if (!existingTaskSnapshot.empty) {
        setLoading(false);
        Alert.alert(
          'Thông báo',
          'Bạn đã hoàn thành nhiệm vụ này trong hôm nay rồi',
        );
        navigation.goBack();
        return;
      }

      // Lưu thông tin nhiệm vụ đã hoàn thành
      await firestore().collection('USER_TASKS').add({
        email: user.email,
        taskId: task.id,
        taskName: task.taskName,
        rewardPoints: task.rewardPoints,
        completedAt: firestore.FieldValue.serverTimestamp(),
        completedDate: todayStr,
        beforeImage: beforeImage,
        afterImage: afterImage,
      });

      // Cập nhật điểm cho người dùng
      const userPointsRef = firestore()
        .collection('USER_POINTS')
        .doc(user.email);
      const userPointsDoc = await userPointsRef.get();

      if (userPointsDoc.exists) {
        // Nếu đã có document điểm, cập nhật tăng điểm
        await userPointsRef.update({
          points: firestore.FieldValue.increment(task.rewardPoints),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      } else {
        // Nếu chưa có document điểm, tạo mới
        await userPointsRef.set({
          email: user.email,
          points: task.rewardPoints,
          createdAt: firestore.FieldValue.serverTimestamp(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        });
      }

      setLoading(false);
      Alert.alert(
        'Thành công',
        `Bạn đã hoàn thành nhiệm vụ và nhận được ${task.rewardPoints} điểm!`,
        [{text: 'OK', onPress: () => navigation.goBack()}],
      );
    } catch (error) {
      console.error('Lỗi khi xác nhận nhiệm vụ:', error);
      setLoading(false);
      Alert.alert(
        'Lỗi',
        'Không thể hoàn thành nhiệm vụ. Vui lòng thử lại sau!',
      );
    }
  };

  // Tính toán số lượng ảnh đã tải lên
  const uploadedImages = (beforeImage ? 1 : 0) + (afterImage ? 1 : 0);
  // Tính toán phần trăm hoàn thành
  const progressPercentage = (uploadedImages / 2) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="#4c8d6e"
      />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hoàn thành nhiệm vụ</Text>
        <View style={styles.pointsBadge}>
          <Text style={styles.pointsText}>+{task.rewardPoints} điểm</Text>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* Task Info */}
        <View style={styles.taskCard}>
          <Text style={styles.taskTitle}>{task.taskName}</Text>
          <Text style={styles.taskDescription}>
            {task.taskDescription ||
              'Thu gom và tái chế 3 chai nhựa để giảm rác thải nhựa ra môi trường'}
          </Text>

          {/* Instructions */}
          <View style={styles.instructionsBox}>
            <Text style={styles.instructionsTitle}>
              <Icon
                name="information-circle-outline"
                size={16}
                color="#4CAF50"
              />{' '}
              Hướng dẫn
            </Text>
            <Text style={styles.instructionsText}>
              Chụp ảnh 3 chai nhựa trước khi tái chế và ảnh sau khi bạn đã đưa
              chúng vào thùng tái chế hoặc điểm thu gom.
            </Text>
          </View>
        </View>

        {/* Upload Images Section */}
        <Text style={styles.sectionTitle}>Tải lên hình ảnh</Text>

        <View style={styles.imagesContainer}>
          {/* Before Image */}
          <View style={styles.imageColumn}>
            <Text style={styles.imageLabel}>Trước khi thực hiện</Text>
            <TouchableOpacity
              style={styles.imageUploadBox}
              onPress={selectBeforeImage}>
              {beforeImage ? (
                <Image
                  source={{uri: beforeImage}}
                  style={styles.previewImage}
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Icon name="camera-outline" size={32} color="#AAAAAA" />
                  <Text style={styles.placeholderText}>Nhấn để chụp ảnh</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* After Image */}
          <View style={styles.imageColumn}>
            <Text style={styles.imageLabel}>Sau khi thực hiện</Text>
            <TouchableOpacity
              style={styles.imageUploadBox}
              onPress={selectAfterImage}>
              {afterImage ? (
                <Image source={{uri: afterImage}} style={styles.previewImage} />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Icon name="camera-outline" size={32} color="#AAAAAA" />
                  <Text style={styles.placeholderText}>Nhấn để chụp ảnh</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <Text style={styles.progressText}>Tiến độ</Text>
          <Text style={styles.progressCount}>{uploadedImages}/2 hình ảnh</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressBarContainer}>
          <View
            style={[styles.progressBar, {width: `${progressPercentage}%`}]}
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!beforeImage || !afterImage) && styles.disabledButton,
          ]}
          onPress={handleSubmit}
          disabled={!beforeImage || !afterImage || loading}>
          {loading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.submitButtonText}>Xác nhận hoàn thành</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    marginTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green,
    paddingVertical: 15,
    paddingHorizontal: 16,
    elevation: 3,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  pointsBadge: {
    backgroundColor: 'white',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 15,
  },
  pointsText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  taskCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    elevation: 1,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  taskDescription: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 16,
  },
  instructionsBox: {
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
    padding: 12,
  },
  instructionsTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 6,
  },
  instructionsText: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333333',
  },
  imagesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  imageColumn: {
    flex: 1,
    marginHorizontal: 4,
  },
  imageLabel: {
    fontSize: 14,
    color: '#555555',
    marginBottom: 8,
  },
  imageUploadBox: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#AAAAAA',
    borderRadius: 8,
    height: 160,
    overflow: 'hidden',
    backgroundColor: 'white',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: 8,
    fontSize: 12,
    color: '#AAAAAA',
  },
  progressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
  progressCount: {
    fontSize: 14,
    color: '#555555',
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    marginBottom: 24,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 3,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  disabledButton: {
    backgroundColor: '#AAAAAA',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ConfirmTaskScreen;
