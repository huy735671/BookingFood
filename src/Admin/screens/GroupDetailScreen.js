import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from '../../component/Icon';

const GroupDetailScreen = ({route, navigation}) => {
  const {group} = route.params; // Nhận dữ liệu nhóm từ navigation
  const [creatorInfo, setCreatorInfo] = useState(null);

  useEffect(() => {
    const fetchCreatorInfo = async () => {
      try {
        if (typeof group.createdBy === 'string') {
          const userDoc = await firestore()
            .collection('users')
            .doc(group.createdBy)
            .get();
          if (userDoc.exists) {
            setCreatorInfo(userDoc.data());
          }
        } else if (typeof group.createdBy === 'object') {
          setCreatorInfo(group.createdBy);
        }
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
      }
    };

    fetchCreatorInfo();
  }, [group.createdBy]);

  // ✅ Di chuyển handleUpdateStatus vào trong GroupDetailScreen
  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await firestore()
        .collection('GROUPS')
        .doc(id)
        .update({status: newStatus});

      navigation.goBack(); 

    } catch (error) {
      console.error('Lỗi khi cập nhật trạng thái nhóm:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Ảnh nền & Nút đóng */}
      <View style={styles.headerContainer}>
        <Image source={{uri: group.groupImage}} style={styles.headerImage} />
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.closeButton}>
          {/* <Feather name="x" size={24} color="#555" /> */}
        </TouchableOpacity>
      </View>

      {/* Nội dung */}
      <View style={styles.content}>
        {/* Trạng thái */}
        <View
          style={[
            styles.statusBadge,
            group.status === 'pending' ? styles.pending : styles.approved,
          ]}>
          <Text style={styles.statusText}>
            {group.status === 'pending' ? 'Chờ duyệt' : 'Đã duyệt'}
          </Text>
        </View>

        {/* Tiêu đề & Thông tin ngày tạo */}
        <Text style={styles.title}>{group.groupName}</Text>
        <Text style={styles.date}>
          📅 Tạo ngày{' '}
          {group.createdAt
            ? new Date(group.createdAt).toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : 'Không xác định'}
          • 📍 {group.location}
        </Text>

        {/* Thông tin người tạo */}
        <View style={styles.creatorInfo}>
          <View style={styles.avatarPlaceholder}>
            <Icon icon="User" size={32} color="#ccc" />
          </View>
          <View>
            <Text style={styles.creatorName}>
              {group.createdBy?.fullName || 'Không có thông tin'}
            </Text>
            <Text style={styles.creatorContact}>
              <Icon icon="Email" size={16} color="green" />
              {group.createdBy?.email || 'Không có email'}
            </Text>
            <Text style={styles.creatorContact}>
              <Icon icon="Phone" size={16} color="green" />{' '}
              {group.createdBy?.phoneNumber || 'Không có số điện thoại'}
            </Text>
          </View>
        </View>

        {/* Giới thiệu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Giới thiệu</Text>
          <Text style={styles.sectionText}>{group.groupDescription}</Text>
        </View>

        {/* Danh mục */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Danh mục</Text>
          <Text style={styles.category}>✅ {group.category}</Text>
        </View>

        {/* Mục tiêu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mục tiêu</Text>
          <Text style={styles.sectionText}>{group.groupGoal}</Text>
        </View>

        {/* Hoạt động dự kiến */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hoạt động dự kiến</Text>
          <TextInput
            style={styles.input}
            placeholder="Nhập hoạt động dự kiến"
            value="Đang lên kế hoạch"
          />
        </View>

        {/* Nút từ chối & duyệt */}
        {group.status === 'pending' && (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => handleUpdateStatus(group.id, 'rejected')}>
              <Text style={styles.rejectText}>❌ Từ chối</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.approveButton}
              onPress={() => handleUpdateStatus(group.id, 'approved')}>
              <Text style={styles.approveText}>✅ Duyệt</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {backgroundColor: '#f5f5f5'},
  headerContainer: {position: 'relative', alignItems: 'center'},
  headerImage: {width: '100%', height: 200, backgroundColor: '#ddd'},
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 8,
    backgroundColor: 'white',
    borderRadius: 20,
  },
  content: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: -20,
  },
  statusBadge: {alignSelf: 'flex-start', padding: 6, borderRadius: 6},
  pending: {backgroundColor: '#FFA500'},
  approved: {backgroundColor: '#27AE60'},
  statusText: {color: '#fff', fontWeight: 'bold'},
  title: {fontSize: 22, fontWeight: 'bold', marginTop: 8},
  date: {color: '#555', marginTop: 4},
  creatorInfo: {flexDirection: 'row', alignItems: 'center', marginTop: 16},
  avatarPlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  creatorName: {fontSize: 16, fontWeight: 'bold'},
  creatorContact: {color: 'green', fontSize: 14},
  section: {marginTop: 12},
  sectionTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 4},
  sectionText: {color: '#333'},
  category: {fontSize: 14, fontWeight: 'bold', color: 'green'},
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginTop: 4,
    backgroundColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  rejectButton: {
    backgroundColor: '#E74C3C',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  rejectText: {color: '#fff', fontWeight: 'bold'},
  approveButton: {
    backgroundColor: '#27AE60',
    padding: 12,
    borderRadius: 8,
    flex: 1,
    alignItems: 'center',
  },
  approveText: {color: '#fff', fontWeight: 'bold'},
});

export default GroupDetailScreen;
