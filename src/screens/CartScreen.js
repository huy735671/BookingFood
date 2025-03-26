import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {useNavigation, useFocusEffect} from '@react-navigation/native';
import {colors, sizes} from '../constants/theme';
import auth from '@react-native-firebase/auth';
import Icon from '../component/Icon';

const CartScreen = () => {
  const navigation = useNavigation();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [userPoints, setUserPoints] = useState(0);

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const user = auth().currentUser;
      if (!user) {
        setLoading(false);
        return;
      }

      // Lấy ngày hiện tại để kiểm tra và reset nhiệm vụ
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayStr = today.toISOString().split('T')[0];

      // Lấy tất cả nhiệm vụ từ collection TASKS
      const taskSnapshot = await firestore().collection('TASKS').get();
      const allTasks = taskSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        completed: false, // Trạng thái mặc định là chưa hoàn thành
      }));

      // Lọc ra các nhiệm vụ daily
      const dailyTasks = allTasks.filter(task => task.taskType === 'daily');

      // Lấy danh sách các nhiệm vụ đã hoàn thành trong ngày
      const completedTasksSnapshot = await firestore()
        .collection('USER_TASKS')
        .where('email', '==', user.email)
        .where('completedDate', '==', todayStr)
        .get();

      // Lấy ID của các nhiệm vụ đã hoàn thành
      const completedTaskIds = completedTasksSnapshot.docs.map(
        doc => doc.data().taskId,
      );

      // Cập nhật trạng thái cho các nhiệm vụ đã hoàn thành
      const updatedDailyTasks = dailyTasks.map(task => ({
        ...task,
        completed: completedTaskIds.includes(task.id),
      }));

      // Chọn ngẫu nhiên 7 nhiệm vụ hoặc lấy tất cả nếu có ít hơn 7
      const shuffledTasks = updatedDailyTasks
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.min(7, updatedDailyTasks.length));

      setTasks(shuffledTasks);

      // Lấy tổng điểm hiện tại của người dùng
      const userPointsDoc = await firestore()
        .collection('USER_POINTS')
        .doc(user.email)
        .get();

      if (userPointsDoc.exists) {
        setUserPoints(userPointsDoc.data().points || 0);
      }
    } catch (error) {
      console.error('Lỗi khi lấy nhiệm vụ:', error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, []),
  );

  const handleTabChange = tab => {
    setActiveTab(tab);
  };

  const handleCompleteTask = task => {
    // Kiểm tra nếu nhiệm vụ đã hoàn thành
    if (task.completed) {
      Alert.alert(
        'Thông báo',
        'Bạn đã hoàn thành nhiệm vụ này trong hôm nay rồi',
      );
      return;
    }

    // Chuyển đến màn hình xác nhận nhiệm vụ
    navigation.navigate('ConfirmTaskScreen', {task});
  };

  const handleGiftPress = () => {
    const user = auth().currentUser;
    if (user) {
      navigation.navigate('GiftScreen', {userEmail: user.email});
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalPoints = tasks.reduce(
    (total, task) => total + (task.completed ? task.rewardPoints : 0),
    0,
  );

  const filterTasks = () => {
    if (activeTab === 'all') return tasks;
    if (activeTab === 'incomplete')
      return tasks.filter(task => !task.completed);
    if (activeTab === 'completed') return tasks.filter(task => task.completed);
  };

  const progressPercentage = totalTasks
    ? (completedTasks / totalTasks) * 100
    : 0;

  // Tính toán thời gian còn lại trong ngày
  const getTimeRemaining = () => {
    const now = new Date();
    const end = new Date(now);
    end.setHours(23, 59, 59, 999);

    const diff = end - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    return `${hours}:${minutes < 10 ? '0' + minutes : minutes}:${
      seconds < 10 ? '0' + seconds : seconds
    }`;
  };

  const [timeRemaining, setTimeRemaining] = useState(getTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{textAlign: 'center', marginTop: 20}}>
          Đang tải nhiệm vụ...
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.bodyContainer}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="#4c8d6e"
      />
      <View style={styles.header}>
        <Text style={styles.title}>Nhiệm vụ hằng ngày</Text>
        <TouchableOpacity onPress={handleGiftPress}>
          <Icon icon="gift" size={20} color={colors.light} />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.progressContainer}>
          <View style={styles.progressView}>
            <Text style={styles.progressText}>Tiến độ hôm nay</Text>
            <Text style={styles.progressText}>
              {completedTasks}/{totalTasks} nhiệm vụ
            </Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progress, {width: `${progressPercentage}%`}]}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              paddingTop: 10,
            }}>
            <View>
              <Text>Điểm đã kiếm được</Text>
              <Text style={styles.pointsText}>{totalPoints} điểm</Text>
            </View>
            <View>
              <Text>Thời gian còn lại</Text>
              <Text style={styles.pointsText}>{timeRemaining}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tabsContainer}>
          <TouchableOpacity
            onPress={() => handleTabChange('all')}
            style={[styles.tabButton, activeTab === 'all' && styles.activeTab]}>
            <Text style={styles.tabText}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabChange('incomplete')}
            style={[
              styles.tabButton,
              activeTab === 'incomplete' && styles.activeTab,
            ]}>
            <Text style={styles.tabText}>Chưa hoàn thành</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleTabChange('completed')}
            style={[
              styles.tabButton,
              activeTab === 'completed' && styles.activeTab,
            ]}>
            <Text style={styles.tabText}>Đã hoàn thành</Text>
          </TouchableOpacity>
        </View>

        <View
          style={styles.taskListContainer}
          showsVerticalScrollIndicator={false}>
          {filterTasks().map(task => (
            <View
              key={task.id}
              style={[
                styles.taskItem,
                task.completed && {borderColor: colors.green},
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text style={styles.taskTitle}>{task.taskName}</Text>
                <Text style={styles.taskPoints}>+{task.rewardPoints}</Text>
              </View>
              <Text style={styles.taskDescription}>{task.taskDescription}</Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() =>
                    navigation.navigate('TaskDetail', {taskId: task.id})
                  }>
                  <View style={styles.detailsButton}>
                    <Text style={styles.buttonText}>Chi tiết</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.completeButton,
                    task.completed && {backgroundColor: '#ccc'},
                  ]}
                  disabled={task.completed}
                  onPress={() => handleCompleteTask(task)}>
                  <Text style={styles.buttonText}>
                    {task.completed ? 'Đã hoàn thành' : 'Hoàn thành'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  bodyContainer: {
    marginTop: 40,
    backgroundColor: '#fff',
  },
  container: {
    padding: 10,
  },
  header: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
    backgroundColor: colors.green,
    padding: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.light,
  },
  progressContainer: {
    borderRadius: 6,
    borderColor: colors.green,
    marginBottom: 12,
    borderWidth: 1,
    padding: 20,
  },
  progressView: {flexDirection: 'row', justifyContent: 'space-between'},
  progressText: {
    color: colors.green,
    fontSize: 16,
    marginBottom: 5,
    paddingBottom: 5,
  },
  progressBar: {height: 10, backgroundColor: '#f0f0f0', borderRadius: 5},
  progress: {height: '100%', backgroundColor: colors.primary, borderRadius: 5},
  pointsText: {fontSize: sizes.h3, fontWeight: 'bold', color: colors.green},

  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: 6,
  },
  activeTab: {backgroundColor: colors.green, borderRadius: 6},
  tabButton: {padding: 10},
  tabText: {fontSize: sizes.body, fontWeight: 'bold'},
  taskListContainer: {flex: 1},
  taskItem: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  taskTitle: {fontSize: 18, fontWeight: 'bold', flexShrink: 1},
  taskPoints: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 16,
    marginTop: 5,
  },
  taskDescription: {fontSize: 14, marginTop: 5},
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
    alignItems: 'center',
  },
  completeButton: {
    backgroundColor: colors.green,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  detailsButton: {
    borderWidth: 1,
    padding: 6,
    marginRight: 5,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: 14,
  },
});

export default CartScreen;
