import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

const GroupList = ({groups}) => {
  const navigation = useNavigation();

  const userEmail = auth().currentUser?.email;

  // Lọc danh sách chỉ lấy nhóm có status là "approved"
  const approvedGroups = groups.filter(item => item.status === 'approved');

  // Hàm xử lý tham gia nhóm
  const handleJoinGroup = async (groupId) => {
    Alert.alert(
      "Xác nhận",
      "Bạn có chắc chắn muốn tham gia hội nhóm này không?",
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Xác nhận",
          onPress: async () => {
            try {
              const user = auth().currentUser;
              if (!user) {
                Alert.alert("Lỗi", "Bạn cần đăng nhập để tham gia nhóm.");
                return;
              }
  
              const groupRef = firestore().collection("GROUPS").doc(groupId);
              const groupDoc = await groupRef.get();
  
              if (!groupDoc.exists) {
                Alert.alert("Lỗi", "Nhóm không tồn tại hoặc đã bị xóa.");
                return;
              }
  
              const groupData = groupDoc.data();
              const currentMembers = groupData.members || [];
  
              // Kiểm tra nếu user đã là thành viên thì không thêm nữa
              if (currentMembers.some((member) => member.email === user.email)) {
                Alert.alert("Thông báo", "Bạn đã là thành viên của nhóm này.");
                return;
              }
  
              // 🔥 Tìm user trong collection "USERS" dựa theo email
              const usersCollection = firestore().collection("users");
              const userSnapshot = await usersCollection
                .where("email", "==", user.email)
                .limit(1)
                .get();
  
              let fullName = "Người dùng mới";
              if (!userSnapshot.empty) {
                fullName = userSnapshot.docs[0].data().fullName || fullName;
              }
  
              const joinDate = new Date().toISOString(); // Lưu ngày tham gia dưới dạng chuỗi
  
              // Cập nhật danh sách thành viên
              const updatedMembers = [
                ...currentMembers,
                {
                  email: user.email,
                  fullName: fullName,
                  joinedAt: joinDate,
                },
              ];
  
              await groupRef.update({ members: updatedMembers });
  
              Alert.alert("Thành công", "Bạn đã tham gia hội nhóm!");
            } catch (error) {
              console.error("Lỗi khi tham gia nhóm:", error);
              Alert.alert("Lỗi", "Không thể tham gia nhóm, vui lòng thử lại!");
            }
          },
        },
      ]
    );
  };
  

  return (
    <View>
      {approvedGroups.map(item => {
        const isOwner = item.createdBy?.email === userEmail; // Kiểm tra người dùng có phải chủ nhóm không
        const isMember = item.members?.some(
          member => member.email === userEmail,
        ); // Kiểm tra user đã tham gia nhóm chưa

        return (
          <View key={item.id} style={styles.groupCard}>
            {/* Hình ảnh nhóm bên trái */}
            <Image source={{uri: item.groupImage}} style={styles.groupImage} />

            {/* Nội dung nhóm bên phải */}
            <View style={styles.groupInfoContainer}>
              <Text style={styles.groupTitle}>{item.groupName}</Text>
              <Text style={styles.groupInfo}>
                {item.members?.length || 0} thành viên • {item.location}
              </Text>

              {/* Hàng nút bấm */}
              <View style={styles.buttonRow}>
                {isOwner || isMember ? (
                  <TouchableOpacity
                    style={styles.ownerButton}
                    onPress={() => navigation.navigate('GroupDetailScreen', { group: item })}>
                    <Text style={styles.buttonText}>Vào</Text>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.joinedButton}
                    onPress={() => handleJoinGroup(item.id)}>
                    <Text style={styles.buttonText}>Tham gia</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  groupCard: {
    flexDirection: 'row',
    backgroundColor: 'white',
    padding: 10,
    margin: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  groupImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  groupInfoContainer: {
    flex: 1,
  },
  groupTitle: {fontSize: 16, fontWeight: 'bold'},
  groupInfo: {color: '#777', marginBottom: 5},
  buttonRow: {
    flexDirection: 'row',
    marginTop: 5,
  },
  joinedButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginRight: 10,
  },
  ownerButton: {
    backgroundColor: '#FFA500', // Màu cam cho nút Vào
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {color: 'white'},
});

export default GroupList;
