import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Switch,
  StyleSheet,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const TaskScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('Tất cả');
  const [tasks, setTasks] = useState([]);

  // Lấy dữ liệu từ Firestore
  useEffect(() => {
    const unsubscribe = firestore()
      .collection('TASKS') // Thay bằng tên collection của bạn
      .onSnapshot(querySnapshot => {
        const taskList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(taskList);
      });

    return () => unsubscribe(); // Hủy đăng ký khi component unmount
  }, []);

  // Lọc danh sách nhiệm vụ theo tìm kiếm
  const filteredTasks = tasks.filter(
    task =>
      task.taskName &&
      task.taskName.toLowerCase().includes(searchText.toLowerCase()),
  );

  // Cập nhật trạng thái nhiệm vụ trong Firestore
  const toggleTaskStatus = async (id, currentStatus) => {
    try {
      const newStatus = !currentStatus;

      // Cập nhật trên Firestore
      await firestore().collection('TASKS').doc(id).update({
        isTaskActive: newStatus, // Cập nhật đúng trường isTaskActive
      });

      // Cập nhật trực tiếp trên state để UI phản hồi ngay
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === id ? {...task, isTaskActive: newStatus} : task,
        ),
      );
    } catch (error) {
      console.error('Lỗi cập nhật trạng thái:', error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm + nút thêm */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm nhiệm vụ..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('TaskFormScreen', {mode: 'add'})}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* Bộ lọc */}
      <View style={styles.filterContainer}>
        {['Tất cả', 'Hàng ngày', 'Hàng tuần', 'Thử thách'].map(filter => (
          <TouchableOpacity
            key={filter}
            style={[
              styles.filterButton,
              selectedFilter === filter && styles.activeFilter,
            ]}
            onPress={() => setSelectedFilter(filter)}>
            <Text
              style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText,
              ]}>
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Danh sách nhiệm vụ */}
      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View >
            <View style={styles.taskItem}>
              <Text style={styles.taskTitle}>{item.taskName}</Text>
              <Text style={styles.taskDescription}>{item.taskDescription}</Text>
              <View style={styles.taskInfo}>
                <Text style={styles.taskTag}>Loại: {item.taskType}</Text>
                <Text style={styles.taskTag}>Điểm: +{item.rewardPoints}</Text>
                <Text style={styles.taskTag}>
                  Hoàn thành: {item.verificationMethod}
                </Text>
              </View>
              <View style={styles.taskFooter}>
                <Switch
                  value={item.isTaskActive ?? false}
                  onValueChange={() =>
                    toggleTaskStatus(item.id, item.isTaskActive ?? false)
                  }
                />

                <TouchableOpacity
                  style={styles.manageButton}
                  onPress={() => {
                    navigation.navigate('TaskFormScreen', {
                      mode: 'edit',
                      taskData: item,
                    });
                  }}>
                  <Text style={styles.manageButtonText}>Quản lý</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default TaskScreen;

// 💄 Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#ddd',
    borderRadius: 6,
  },
  activeFilter: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '500',
  },
  activeFilterText: {
    color: '#fff',
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
  },
  taskInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  taskTag: {
    fontSize: 12,
    backgroundColor: '#eee',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  manageButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  manageButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
