import React, { useState } from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const FeaturedGroup = ({ groups }) => {
  if (!groups || groups.length === 0) return null;

  const navigation = useNavigation();
  const userEmail = auth().currentUser?.email;
  const [updating, setUpdating] = useState(false);

  // Tìm nhóm có nhiều thành viên nhất
  const topGroup = groups.reduce((max, group) => 
    group.members?.length > (max.members?.length || 0) ? group : max, 
    groups[0]
  );

  const handleJoinGroup = async () => {
    if (updating) return;
    setUpdating(true);

    try {
      const userRef = firestore().collection('users').doc(userEmail);
      const userSnapshot = await userRef.get();

      if (!userSnapshot.exists) {
        console.error('User not found in Firestore');
        setUpdating(false);
        return;
      }

      const userData = userSnapshot.data();
      const fullName = userData.fullName || 'Người dùng ẩn danh';

      const groupRef = firestore().collection('GROUPS').doc(topGroup.id);
      const updatedMembers = [
        ...(topGroup.members || []),
        { email: userEmail, fullName, joinedAt: new Date().toISOString() }
      ];

      await groupRef.update({ members: updatedMembers });

      // Cập nhật UI ngay lập tức
      topGroup.members = updatedMembers;
      setUpdating(false);
    } catch (error) {
      console.error('Lỗi khi tham gia nhóm:', error);
      setUpdating(false);
    }
  };

  if (!topGroup) return null;

  const isCreator = topGroup.createdBy?.email === userEmail;
  const isMember = topGroup.members?.some(member => member.email === userEmail);
  const isAuthorized = isCreator || isMember;

  return (
    <View style={styles.container}>
      <View style={styles.featuredContainer}>
        <ImageBackground
          source={{ uri: topGroup.groupImage || 'https://via.placeholder.com/500' }}
          style={styles.featuredImage}>
          <View style={styles.overlay}>
            <Text style={styles.featuredLabel}>Nổi bật</Text>
            <Text style={styles.featuredTitle}>{topGroup.groupName}</Text>
            <Text style={styles.featuredInfo}>
              {topGroup.members?.length || 0} thành viên • {topGroup.location}
            </Text>
          </View>
        </ImageBackground>
        <View style={styles.infoContainer}>
          <Text style={styles.groupDescription}>{topGroup.groupDescription}</Text>
          <View style={styles.buttonContainer}>
            {isAuthorized ? (
              <TouchableOpacity 
                style={styles.enterButton} 
                onPress={() => navigation.navigate('GroupDetailScreen', { group: topGroup })}>
                <Text style={styles.buttonText}>Vào</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={styles.joinButton} onPress={handleJoinGroup} disabled={updating}>
                  <Text style={styles.buttonText}>{updating ? 'Đang tham gia...' : 'Tham gia'}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.detailButton}>
                  <Text style={styles.detailText}>Xem chi tiết</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  featuredContainer: { margin: 10, borderRadius: 10, overflow: 'hidden' },
  featuredImage: { height: 180, justifyContent: 'flex-end' },
  overlay: { backgroundColor: 'rgba(0,0,0,0.5)', padding: 10 },
  featuredLabel: { color: 'white', fontWeight: 'bold' },
  featuredTitle: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  featuredInfo: { color: 'white' },
  infoContainer: { padding: 10, backgroundColor: 'white' },
  groupDescription: { fontSize: 14, color: '#666' },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 10,
  },
  joinButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  enterButton: {
    flex: 1,
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  detailButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#4CAF50',
    alignItems: 'center',
  },
  buttonText: { color: 'white', fontWeight: 'bold' },
  detailText: { color: '#4CAF50', fontWeight: 'bold' },
});

export default FeaturedGroup;
