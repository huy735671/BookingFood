import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const GroupManagementScreen = () => {
  const [groups, setGroups] = useState([]);
  const [filterStatus, setFilterStatus] = useState('pending'); // Mặc định là "Chờ duyệt"
const navigation = useNavigation();
useEffect(() => {
    const unsubscribe = firestore()
      .collection('GROUPS')
      .onSnapshot(snapshot => {
        const groupData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt
              ? new Date(data.createdAt._seconds * 1000).toLocaleDateString(
                  'vi-VN',
                )
              : 'Không xác định',
          };
        });
        setGroups(groupData);
      });
  
    return () => unsubscribe(); // Hủy đăng ký khi component unmount
  }, []);
  

  const handleUpdateStatus = async (groupId, newStatus) => {
    try {
      await firestore().collection('GROUPS').doc(groupId).update({
        status: newStatus,
      });
      setGroups(prevGroups =>
        prevGroups.map(group =>
          group.id === groupId ? {...group, status: newStatus} : group,
        ),
      );
    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái:', error);
    }
  };

  // Lọc nhóm theo trạng thái
  const filteredGroups = groups.filter(group => group.status === filterStatus);

  return (
    <View style={styles.container}>
      {/* Tab chuyển trạng thái */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          onPress={() => setFilterStatus('pending')}
          style={[styles.tab, filterStatus === 'pending' && styles.activeTab]}>
          <Text style={styles.tabText}>Chờ duyệt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilterStatus('approved')}
          style={[styles.tab, filterStatus === 'approved' && styles.activeTab]}>
          <Text style={styles.tabText}>Đã duyệt</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setFilterStatus('rejected')}
          style={[styles.tab, filterStatus === 'rejected' && styles.activeTab]}>
          <Text style={styles.tabText}>Đã từ chối</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách nhóm */}
      <FlatList
        data={filteredGroups}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.card}>
            {/* Hình ảnh nhóm */}
            <Image source={{uri: item.groupImage}} style={styles.image} />

            {/* Thông tin nhóm */}
            <View style={styles.info}>
              <Text style={styles.title}>{item.groupName}</Text>
              <Text style={styles.subtitle}>
                {item.createdAt} • {item.location}
              </Text>
              <Text style={styles.description} numberOfLines={2}>
                {item.groupDescription}
              </Text>

              {filterStatus === 'pending' && (
                <View style={styles.buttonContainer}>
                  <TouchableOpacity
                    style={styles.detailButton}
                    onPress={() =>
                      navigation.navigate('GroupDetailScreen', {group: item})
                    }>
                    <Text style={styles.detailText}>Chi tiết</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.approveButton}
                    onPress={() => handleUpdateStatus(item.id, 'approved')}>
                    <Text style={styles.approveText}>Duyệt</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => handleUpdateStatus(item.id, 'rejected')}>
                    <Text style={styles.rejectText}>Từ chối</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  tabContainer: {flexDirection: 'row', backgroundColor: '#fff', padding: 10},
  tab: {flex: 1, alignItems: 'center', padding: 10},
  activeTab: {borderBottomWidth: 3, borderBottomColor: 'green'},
  tabText: {fontWeight: 'bold', color: '#333'},
  card: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    padding: 10,
    borderRadius: 8,
    elevation: 3,
  },
  image: {width: 80, height: 80, borderRadius: 10, backgroundColor: '#ddd'},
  info: {flex: 1, marginLeft: 10},
  title: {fontSize: 16, fontWeight: 'bold'},
  subtitle: {fontSize: 12, color: '#666', marginVertical: 5},
  description: {fontSize: 13, color: '#444'},
  buttonContainer: {flexDirection: 'row', marginTop: 10},
  detailButton: {
    flex: 1,
    padding: 8,
    borderRadius: 5,
    borderColor: '#666',
    borderWidth: 1,
    alignItems: 'center',
    marginRight: 5,
  },
  detailText: {color: '#333'},
  approveButton: {
    flex: 1,
    padding: 8,
    borderRadius: 5,
    backgroundColor: 'green',
    alignItems: 'center',
    marginRight: 5,
  },
  approveText: {color: '#fff'},
  rejectButton: {
    flex: 1,
    padding: 8,
    borderRadius: 5,
    backgroundColor: 'red',
    alignItems: 'center',
  },
  rejectText: {color: '#fff'},
});

export default GroupManagementScreen;
