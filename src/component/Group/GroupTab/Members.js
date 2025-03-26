import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Members = ({group}) => {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [contributionsMap, setContributionsMap] = useState({});
  const [allMembers, setAllMembers] = useState([]);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setCurrentUserEmail(user.email);
      console.log('Email người đăng nhập:', user.email);
    }
  }, []);

  useEffect(() => {
    if (!group?.id) return;

    const fetchContributions = async () => {
      try {
        const snapshot = await firestore()
          .collection('POINT_EVENT_GROUPS')
          .where('groupId', '==', group.id)
          .get();

        let contributionsData = {};
        snapshot.forEach(doc => {
          const data = doc.data();
          contributionsData[data.userId] = data.totalPoints || 0;
        });

        setContributionsMap(contributionsData);
      } catch (error) {
        console.error('Lỗi khi lấy dữ liệu POINT_EVENT_GROUPS:', error);
      }
    };

    fetchContributions();
  }, [group?.id]);

  useEffect(() => {
    if (!group?.createdBy) return;

    // Gộp danh sách members và createdBy thành một mảng duy nhất
    let combinedMembers = [...(group.members || [])];

    if (group.createdBy?.email) {
      // Nếu người tạo nhóm chưa có trong danh sách, thêm vào
      const isCreatorInList = combinedMembers.some(
        member => member.email === group.createdBy.email,
      );

      if (!isCreatorInList) {
        combinedMembers.unshift({
          ...group.createdBy,
          role: 'Người tạo nhóm', // Gán vai trò riêng cho người tạo
        });
      }
    }

    setAllMembers(combinedMembers);
  }, [group?.members, group?.createdBy]);

  const formatDate = isoString => {
    if (!isoString) return 'Không rõ';
    return new Date(isoString).toLocaleDateString('vi-VN');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thành viên ({allMembers.length})</Text>
        <TextInput style={styles.searchInput} placeholder="Tìm thành viên..." />
      </View>

      {allMembers.length > 0 ? (
        <FlatList
          data={allMembers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item}) => {
            const contributions = contributionsMap[item.email] || 0;
            return (
              <View
                style={[
                  styles.memberCard,
                  item.email === currentUserEmail && styles.highlightCard,
                ]}>
                <Image
                  source={{
                    uri:
                      item.avatar ||
                      'https://media.istockphoto.com/id/1288129985/vi/vec-to/thiếu-hình-ảnh-của-trình-giữ-chỗ-cho-một-người.jpg?s=612x612&w=0&k=20&c=2mBRPdxj9u08XRt8L9iu-iLgDEV-ts3uqkkG2ReteTw=',
                  }}
                  style={styles.avatar}
                />
                <View style={styles.memberInfo}>
                  <Text style={styles.memberName}>
                    {item.fullName || 'Tên thành viên'}
                  </Text>

                  {/* Nếu không phải là người tạo nhóm thì hiển thị ngày tham gia */}
                  {item.role !== 'Người tạo nhóm' ? (
                    <Text style={styles.memberDetails}>
                      Tham gia: {formatDate(item.joinedAt)} · {contributions}{' '}
                      đóng góp
                    </Text>
                  ) : (
                    <Text style={styles.memberDetails}>
                      {contributions} đóng góp
                    </Text>
                  )}
                </View>

                {item.role && (
                  <View
                    style={[
                      styles.roleBadge,
                      item.role === 'Người tạo nhóm' && styles.creatorBadge,
                    ]}>
                    <Text style={styles.roleText}>{item.role}</Text>
                  </View>
                )}
              </View>
            );
          }}
          scrollEnabled={false}
        />
      ) : (
        <Text style={styles.noMembers}>Chưa có thành viên nào.</Text>
      )}

      <TouchableOpacity style={styles.addButton}>
        <Text style={styles.addButtonText}>Mời thêm thành viên</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {fontSize: 18, fontWeight: 'bold', color: '#2c7d59'},
  searchInput: {
    flex: 1,
    marginLeft: 10,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f1f1f1',
  },
  memberCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    marginBottom: 10,
  },
  highlightCard: {
    backgroundColor: '#d0f0ff',
    borderWidth: 1,
    borderColor: '#2c7d59',
  },
  avatar: {width: 40, height: 40, borderRadius: 50, marginRight: 10},
  memberInfo: {flex: 1},
  memberName: {fontSize: 16, fontWeight: 'bold'},
  memberDetails: {fontSize: 12, color: '#555'},
  roleBadge: {
    backgroundColor: '#d4f8d4',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 15,
  },
  creatorBadge: {
    backgroundColor: '#ffcccb', // Màu riêng cho người tạo nhóm
  },
  roleText: {fontSize: 12, color: '#2c7d59', fontWeight: 'bold'},
  noMembers: {textAlign: 'center', marginVertical: 20, color: '#999'},
  addButton: {
    backgroundColor: '#2c7d59',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {color: '#fff', fontWeight: 'bold'},
});

export default Members;
