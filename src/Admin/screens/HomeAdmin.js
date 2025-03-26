import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from '../../component/Icon';

const HomeAdmin = ({navigation}) => {
  const [usersCount, setUsersCount] = useState(0);
  const [eventsCount, setEventsCount] = useState(0);
  const [pendingGroups, setPendingGroups] = useState([]);

  // Lấy dữ liệu từ Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersSnapshot = await firestore().collection('users').get();
        const eventsSnapshot = await firestore().collection('EVENTS').get();

        // Lấy danh sách nhóm có trạng thái "pending"
        const groupsSnapshot = await firestore()
          .collection('GROUPS')
          .where('status', '==', 'pending')
          .get();

        setUsersCount(usersSnapshot.size);
        setEventsCount(eventsSnapshot.size);
        setPendingGroups(groupsSnapshot.docs.map(doc => doc.data()));

        console.log(
          'Nhóm đang chờ xét duyệt:',
          groupsSnapshot.docs.map(doc => doc.data()),
        ); // Debug
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.welcomeText}>Xin chào, Admin!</Text>
        <Text style={styles.subtitle}>
          {pendingGroups.length} nhóm đang chờ xét duyệt.
        </Text>
        <TouchableOpacity
          style={styles.manageButton}
          onPress={() => navigation.navigate('GroupManagementScreen')}>
          <Text style={styles.manageButtonText}>Xét duyệt ngay</Text>
        </TouchableOpacity>
      </View>

      {/* Thống kê */}
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Icon icon="User" size={24} color="#4CAF50" />
          <Text style={styles.statLabel}>Người dùng</Text>
          <Text style={styles.statNumber}>{usersCount}</Text>
        </View>
        <View style={styles.statBox}>
          <Icon icon="calendar" size={24} color="#4CAF50" />
          <Text style={styles.statLabel}>Sự kiện</Text>
          <Text style={styles.statNumber}>{eventsCount}</Text>
        </View>
      </View>

      {/* Thao tác nhanh */}
      <Text style={styles.sectionTitle}>Thao tác nhanh</Text>
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('CategoryManagementScreen')}>
          <Icon icon="calendar" size={22} color="#4CAF50" />
          <Text style={styles.actionText}>Quản lý sự kiện</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('UsersManage')}>
          <Icon icon="people" size={22} color="#4CAF50" />
          <Text style={styles.actionText}>Quản lý người dùng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('TaskScreen')}>
          <Icon icon="checked" size={22} color="#4CAF50" />
          <Text style={styles.actionText}>Quản lý nhiệm vụ</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={{}}>
          <Icon icon="gift" size={22} color="#4CAF50" />
          <Text style={styles.actionText}>Quản lý phần thưởng</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách nhóm cần xét duyệt */}
      <Text style={styles.sectionTitle}>Nhóm chờ xét duyệt</Text>
      {pendingGroups.length > 0 ? (
        pendingGroups.map((group, index) => (
          <View key={index} style={styles.groupCard}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupDetail}>Trưởng nhóm: {group.owner}</Text>
            <Text style={styles.groupDetail}>
              Thành viên: {group.members ? group.members.length : 0}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDataText}>
          Không có nhóm nào đang chờ xét duyệt.
        </Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F5F5F5', padding: 16},
  header: {
    backgroundColor: '#4CAF50',
    padding: 20,
    borderRadius: 10,
    marginBottom: 16,
  },
  welcomeText: {fontSize: 20, fontWeight: 'bold', color: '#FFF'},
  subtitle: {color: '#FFF', marginTop: 5},
  manageButton: {
    marginTop: 10,
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  manageButtonText: {color: '#4CAF50', fontWeight: 'bold'},
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statBox: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  statLabel: {fontSize: 14, color: '#333', marginTop: 5},
  statNumber: {fontSize: 20, fontWeight: 'bold', color: '#4CAF50'},
  sectionTitle: {fontSize: 16, fontWeight: 'bold', marginVertical: 10},
  quickActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    width: '48%',
    marginVertical: 5,
  },
  actionText: {fontSize: 14, fontWeight: 'bold', color: '#333', marginTop: 5},
  groupCard: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  groupName: {fontSize: 16, fontWeight: 'bold', color: '#333'},
  groupDetail: {color: '#666', marginTop: 5},
  noDataText: {textAlign: 'center', color: '#666', marginVertical: 10},
});

export default HomeAdmin;
