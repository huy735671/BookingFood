import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import Icon from '../../../Icon';
import { colors, sizes } from '../../../../constants/theme';


const MemberListModal = ({ visible, onClose, memberIds }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      if (!visible || !memberIds || memberIds.length === 0) {
        setMembers([]);
        setLoading(false);
        return;
      }

      try {
        // Fetch details for each member
        const memberPromises = memberIds.map(async (memberId) => {
          const userDoc = await firestore()
            .collection('users')
            .doc(memberId)
            .get();
          
          return userDoc.exists 
            ? { id: memberId, ...userDoc.data() } 
            : null;
        });

        const memberDetails = await Promise.all(memberPromises);
        // Filter out any null results (users not found)
        setMembers(memberDetails.filter(member => member !== null));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching member details:', error);
        setLoading(false);
      }
    };

    fetchMemberDetails();
  }, [visible, memberIds]);

  const renderMemberItem = ({ item }) => (
    <View style={styles.memberItem}>
      <Image 
        source={{ uri: item.avatarUrl || 'https://via.placeholder.com/50' }} 
        style={styles.avatar} 
      />
      <View style={styles.memberInfo}>
        <Text style={styles.memberName}>{item.fullName || 'Unnamed User'}</Text>
        <Text style={styles.memberEmail}>{item.email}</Text>
      </View>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Thành Viên tham gia sự kiện</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Icon icon="close" size={24} color={colors.gray} />
            </TouchableOpacity>
          </View>

          {loading ? (
            <Text style={styles.loadingText}>Đang tải...</Text>
          ) : members.length === 0 ? (
            <Text style={styles.emptyText}>Chưa có thành viên nào</Text>
          ) : (
            <FlatList
              data={members}
              renderItem={renderMemberItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.memberList}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '70%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 10,
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    color: colors.primary,
  },
  closeButton: {
    padding: 5,
  },
  memberList: {
    paddingBottom: 10,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 8,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  memberInfo: {
    flex: 1,
  },
  memberName: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: colors.primary,
  },
  memberEmail: {
    fontSize: sizes.small,
    color: colors.gray,
  },
  loadingText: {
    textAlign: 'center',
    color: colors.gray,
    fontSize: sizes.body,
  },
  emptyText: {
    textAlign: 'center',
    color: colors.gray,
    fontSize: sizes.body,
  },
});

export default MemberListModal;