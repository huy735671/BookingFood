import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Switch,
  ScrollView,
} from 'react-native';
import {Button, RadioButton} from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';

const TaskFormScreen = ({route, navigation}) => {
  const {mode = 'add', taskData = {}} = route.params || {};
  const isEditMode = mode === 'edit';

  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [rewardPoints, setRewardPoints] = useState('');
  const [taskType, setTaskType] = useState('daily');
  const [verificationMethod, setVerificationMethod] = useState('image');

  const [isTaskActive, setIsTaskActive] = useState(true);
  const [isTaskFeatured, setIsTaskFeatured] = useState(true);
  const [completionLimit, setCompletionLimit] = useState('1');
  const [challengeDays, setChallengeDays] = useState('');

  useEffect(() => {
    if (isEditMode && taskData) {

      // Cập nhật từng giá trị
      setTaskName(taskData.taskName || '');
      setTaskDescription(taskData.taskDescription || '');
      setRewardPoints(
        taskData.rewardPoints ? String(taskData.rewardPoints) : '',
      );
      setTaskType(taskData.taskType || 'daily');
      setVerificationMethod(taskData.verificationMethod || 'image');
      setIsTaskActive(taskData.isTaskActive ?? true);
      setIsTaskFeatured(taskData.isTaskFeatured ?? true);
      setCompletionLimit(
        taskData.completionLimit ? String(taskData.completionLimit) : '1',
      );
      setChallengeDays(
        taskData.challengeDays ? String(taskData.challengeDays) : '',
      );

    }
  }, [isEditMode, taskData]);

  // Cập nhật hàm lưu để xử lý cả thêm mới và chỉnh sửa
  const saveTaskToFirestore = async () => {
    if (!taskName.trim() || !taskDescription.trim() || !rewardPoints.trim()) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    try {
      const updatedTaskData = {
        taskName,
        taskDescription,
        rewardPoints: parseInt(rewardPoints, 10),
        taskType,
        verificationMethod,
        isTaskActive,
        isTaskFeatured,
        completionLimit: parseInt(completionLimit, 10),
        challengeDays:
          taskType === 'challenge' ? parseInt(challengeDays, 10) : null,
      };

      if (isEditMode && taskData?.id) {
        // Cập nhật task hiện có
        await firestore()
          .collection('TASKS')
          .doc(taskData.id)
          .update(updatedTaskData);
        alert('Nhiệm vụ đã được cập nhật!');
      } else {
        // Thêm task mới
        updatedTaskData.createdAt = firestore.FieldValue.serverTimestamp();
        await firestore().collection('TASKS').add(updatedTaskData);
        alert('Nhiệm vụ đã được lưu!');
      }

      // Quay lại màn hình danh sách
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi lưu nhiệm vụ:', error);
      alert('Đã xảy ra lỗi khi lưu nhiệm vụ.');
    }
  };

  // Thêm useEffect để kiểm tra form đã được điền chưa
  useEffect(() => {
    console.log('Current form values:', {
      taskName,
      taskDescription,
      rewardPoints,
      taskType,
      verificationMethod,
    });
  }, [taskName, taskDescription, rewardPoints, taskType, verificationMethod]);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Thông tin cơ bản</Text>

        {/* Tên nhiệm vụ */}
        <Text style={styles.label}>Tên nhiệm vụ</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên nhiệm vụ"
          value={taskName}
          onChangeText={setTaskName}
        />

        {/* Mô tả nhiệm vụ */}
        <Text style={styles.label}>Mô tả nhiệm vụ</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Nhập mô tả nhiệm vụ"
          multiline
          numberOfLines={4}
          value={taskDescription}
          onChangeText={setTaskDescription}
        />

        {/* Điểm thưởng */}
        <Text style={styles.label}>Điểm thưởng</Text>
        <TextInput
          style={styles.input}
          placeholder="Nhập điểm thưởng"
          keyboardType="numeric"
          value={rewardPoints}
          onChangeText={setRewardPoints}
        />
      </View>
      <View style={styles.form}>
        {/* Loại nhiệm vụ */}
        <Text style={styles.sectionTitle}>Loại nhiệm vụ</Text>
        <View style={styles.taskTypeContainer}>
          <TouchableOpacity
            style={[
              styles.taskTypeButton,
              taskType === 'daily' && styles.taskTypeActive,
            ]}
            onPress={() => setTaskType('daily')}>
            <Text style={styles.taskTypeText}>Hàng ngày</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.taskTypeButton,
              taskType === 'weekly' && styles.taskTypeActive,
            ]}
            onPress={() => setTaskType('weekly')}>
            <Text style={styles.taskTypeText}>Hàng tuần</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.taskTypeButton,
              taskType === 'challenge' && styles.taskTypeActive,
            ]}
            onPress={() => setTaskType('challenge')}>
            <Text style={styles.taskTypeText}>Thử thách</Text>
          </TouchableOpacity>
        </View>
        {taskType === 'challenge' && (
          <View>
            <Text style={styles.label}>Số ngày thử thách</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập số ngày"
              keyboardType="numeric"
              value={challengeDays}
              onChangeText={setChallengeDays}
            />
          </View>
        )}
      </View>

      {/* Phương thức xác minh */}
      <View style={styles.boxContainer}>
        <Text style={styles.sectionTitle}>Phương thức xác minh</Text>
        <Text style={styles.label}>
          Người dùng cần cung cấp gì để xác minh hoàn thành?
        </Text>
        <RadioButton.Group
          onValueChange={value => setVerificationMethod(value)}
          value={verificationMethod}>
          <View style={styles.radioContainer}>
            <RadioButton value="image" color="#2c7a2c" />
            <Text style={styles.radioText}>Hình ảnh</Text>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton value="location" color="#2c7a2c" />
            <Text style={styles.radioText}>Vị trí</Text>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton value="text" color="#2c7a2c" />
            <Text style={styles.radioText}>Mô tả văn bản</Text>
          </View>
          <View style={styles.radioContainer}>
            <RadioButton value="none" color="#2c7a2c" />
            <Text style={styles.radioText}>Không cần xác minh</Text>
          </View>
        </RadioButton.Group>
      </View>

      {/* Cài đặt bổ sung */}
      <View style={styles.boxContainer}>
        <Text style={styles.sectionTitle}>Cài đặt bổ sung</Text>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Kích hoạt nhiệm vụ</Text>
          <Switch value={isTaskActive} onValueChange={setIsTaskActive} />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Nhiệm vụ nổi bật</Text>
          <Switch value={isTaskFeatured} onValueChange={setIsTaskFeatured} />
        </View>
        <View style={styles.switchContainer}>
          <Text style={styles.label}>Giới hạn hoàn thành</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={completionLimit}
            onChangeText={setCompletionLimit}
          />
        </View>
      </View>

      <Button
        mode="contained"
        style={styles.button}
        onPress={saveTaskToFirestore}>
        Lưu nhiệm vụ
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  form: {
    padding: 10,
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2c7a2c',
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2c7a2c',
    marginBottom: 40,
  },

  boxContainer: {
    backgroundColor: '#f9f9f9',
    padding: 15,
    borderRadius: 10,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  taskTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  taskTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  taskTypeActive: {
    backgroundColor: '#eaf4ea',
    borderColor: '#2c7a2c',
  },
  taskTypeText: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 5,
  },

  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  radioText: {
    fontSize: 14,
  },

  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default TaskFormScreen;
