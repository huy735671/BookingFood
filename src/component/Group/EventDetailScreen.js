import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import {useNavigation, useRoute} from '@react-navigation/native';
import Icon from '../Icon';
import {colors, sizes} from '../../constants/theme';
import MemberListModal from './GroupTab/EventDetail/MemberListModal';

const EventDetailScreen = () => {
  const route = useRoute();
  const {eventId} = route.params;
  const [event, setEvent] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [completionText, setCompletionText] = useState('');
  const [eventDate, setEventDate] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hasCompleted, setHasCompleted] = useState(false);
  const [requests, setRequests] = useState([]);
  const [showMemberModal, setShowMemberModal] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userQuery = await firestore()
            .collection('users')
            .where('email', '==', currentUser.email)
            .limit(1)
            .get();
          if (!userQuery.empty) {
            setUserId(userQuery.docs[0].id);
          }
        }
      } catch (error) {
        console.error('Lỗi khi lấy userId:', error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const eventRef = firestore().collection('EVENTS_GROUPS').doc(eventId);

    const unsubscribe = eventRef.onSnapshot(doc => {
      if (doc.exists) {
        let eventData = doc.data();

        if (eventData.date?.toDate) {
          const eventDateObject = eventData.date.toDate();
          setEventDate(eventDateObject); // Store the event date
          eventData.date = eventDateObject.toLocaleDateString('vi-VN');
        }
        if (eventData.startTime?.seconds) {
          eventData.startTime = new Date(
            eventData.startTime.seconds * 1000,
          ).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'});
        }
        if (eventData.endTime?.seconds) {
          eventData.endTime = new Date(
            eventData.endTime.seconds * 1000,
          ).toLocaleTimeString('vi-VN', {hour: '2-digit', minute: '2-digit'});
        }

        setEvent(eventData);
        setIsMember(eventData.members?.includes(userId) || false);
        setLoading(false);
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [userId]);

  const toggleMembership = async () => {
    if (!userId) return;
    try {
      const eventRef = firestore().collection('EVENTS_GROUPS').doc(eventId);

      const eventSnapshot = await eventRef.get();
      if (!eventSnapshot.exists) return;

      const eventData = eventSnapshot.data();
      let currentMembers = eventData.members || [];

      if (currentMembers.includes(userId)) {
        currentMembers = currentMembers.filter(member => member !== userId);
      } else {
        currentMembers.push(userId);
      }

      await eventRef.update({members: currentMembers});
      setIsMember(currentMembers.includes(userId));
    } catch (error) {
      console.error('Lỗi khi cập nhật thành viên:', error);
    }
  };

  const handleComplete = () => {
    setIsModalVisible(true);
  };

  const handleShowMembers = () => {
    setShowMemberModal(true);
  };

  const handleConfirmCompletion = async () => {
    if (!event || !userId) return;

    try {
      const eventRef = firestore().collection('EVENTS_GROUPS').doc(eventId);
      const userCompletionRef = firestore()
        .collection('LIST_EVENT_COMPLETE')
        .where('eventId', '==', eventId)
        .where('userId', '==', userId);

      // Kiểm tra nếu người dùng đã hoàn thành trước đó
      const existingCompletion = await userCompletionRef.get();
      if (!existingCompletion.empty) {
        alert('Bạn đã hoàn thành sự kiện này rồi!');
        setIsModalVisible(false);
        return;
      }

      const eventDoc = await eventRef.get();
      if (!eventDoc.exists) return;
      const eventData = eventDoc.data();

      // Kiểm tra mã xác nhận
      if (completionText !== eventData.confirmationCode) {
        alert('Mã xác nhận không chính xác!');
        return;
      }

      // Lấy groupId nếu sự kiện có liên kết nhóm
      const groupId = eventData.groupId || 'no-group'; // Nếu không có groupId thì đặt giá trị mặc định

      // Tạo document ID duy nhất theo userId và groupId
      const pointDocId = `${userId}_${groupId}`;
      const pointRef = firestore()
        .collection('POINT_EVENT_GROUPS')
        .doc(pointDocId);
      const pointDoc = await pointRef.get();

      if (pointDoc.exists) {
        // Nếu cùng groupId thì cập nhật điểm
        await pointRef.update({
          totalPoints: firestore.FieldValue.increment(1),
        });
      } else {
        // Nếu khác groupId thì tạo mới
        await pointRef.set({
          userId,
          groupId,
          totalPoints: 1,
        });
      }

      // Thêm vào danh sách hoàn thành `LIST_EVENT_COMPLETE`
      await firestore().collection('LIST_EVENT_COMPLETE').add({
        userId,
        eventId,
        groupId,
        createdAt: firestore.FieldValue.serverTimestamp(),
      });

      alert('Sự kiện đã được hoàn thành!');
      setIsModalVisible(false);
      setCompletionText('');
      setHasCompleted(true); // ✅ Cập nhật trạng thái hoàn thành ngay lập tức
    } catch (error) {
      console.error('Lỗi khi hoàn thành sự kiện:', error);
    }
  };

  useEffect(() => {
    if (!userId || !eventId) return;

    const checkCompletion = async () => {
      const completedRef = firestore()
        .collection('LIST_EVENT_COMPLETE')
        .where('userId', '==', userId)
        .where('eventId', '==', eventId);

      const completedSnap = await completedRef.get();
      setHasCompleted(!completedSnap.empty);
    };

    checkCompletion();
  }, [userId, eventId]);

  // Function to check button availability based on the current date and event date
  const getButtonStatus = () => {
    if (!eventDate) return {};

    if (currentDate < eventDate) {
      return {completeDisabled: true, joinLeaveDisabled: false};
    } else if (currentDate.toDateString() === eventDate.toDateString()) {
      return {completeDisabled: false, joinLeaveDisabled: true};
    } else {
      return {completeDisabled: true, joinLeaveDisabled: true};
    }
  };

  const {completeDisabled, joinLeaveDisabled} = getButtonStatus();

  if (loading)
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loading} />
    );
  if (!event) return <Text style={styles.error}>Không tìm thấy sự kiện.</Text>;

  return (
    <View style={{flex: 1}}>
      <Image source={{uri: event.coverImageUrl}} style={styles.coverImage} />

      <View style={styles.container}>
        <Text style={styles.title}>{event.eventName}</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoBox}>
            <Icon icon="calendar" size={20} color="green" />
            <Text> {event.date}</Text>
          </View>
          <View style={styles.infoBox}>
            <Icon icon="calendar" size={20} color="green" />
            <Text>
              {event.startTime} - {event.endTime}
            </Text>
          </View>
          <View style={styles.infoBox}>
            <Icon icon="Location" size={20} color="green" />
            <Text> {event.location}</Text>
          </View>
          <TouchableOpacity style={styles.infoBox} onPress={handleShowMembers}>
            <Icon icon="people" size={20} color="green" />
            <Text> {event.members?.length || 0} người</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.descriptionTitle}>Mô tả</Text>
        <Text style={styles.description}>
          {event.description || 'Không có mô tả'}
        </Text>
        {event.items && Object.keys(event.items).length > 0 && (
          <Text style={styles.description}>
            Mọi người nhớ mang: {Object.values(event.items).join(', ')}
          </Text>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.closeButton,
              (completeDisabled || hasCompleted) && {opacity: 0.5},
            ]}
            onPress={handleComplete}
            disabled={completeDisabled || hasCompleted}>
            <Text style={styles.buttonText}>Hoàn thành</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={toggleMembership}
            style={[
              styles.button,
              isMember ? styles.leaveButton : styles.joinButton,
              joinLeaveDisabled && {opacity: 0.5},
            ]}
            disabled={joinLeaveDisabled}>
            <Text style={styles.buttonText}>
              {isMember ? 'Rời sự kiện' : 'Tham gia'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nhập mã để hoàn thành</Text>
            <View style={styles.modalDescription}>
              <Icon
                icon="info"
                size={20}
                color="green"
                style={styles.iconStyle}
              />
              <Text style={styles.modalDescriptionText}>
                Nhập mã do ban tổ chức cung cấp khi bạn tham gia sự kiện sẽ được
                tính là đã hoàn thành sự kiện
              </Text>
            </View>
            <TextInput
              style={styles.input}
              placeholder="Nhập mã..."
              value={completionText}
              onChangeText={setCompletionText}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleConfirmCompletion}>
                <Text style={styles.buttonText}>Xác nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setIsModalVisible(false)}>
                <Text style={styles.buttonText}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


      <MemberListModal
        visible={showMemberModal}
        onClose={() => setShowMemberModal(false)}
        memberIds={event.members || []}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  coverImage: {
    width: '100%',
    height: 180,
  },
  title: {fontSize: 24, fontWeight: 'bold', marginBottom: 10},
  infoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    width: '48%',
    justifyContent: 'center',
  },
  descriptionTitle: {
    fontSize: sizes.h3,
    color: colors.primary,
    fontWeight: 'bold',
  },
  description: {
    fontSize: sizes.body,
    color: colors.gray,
    marginVertical: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
  },
  button: {padding: 12, borderRadius: 8, alignItems: 'center', width: '48%'},
  joinButton: {backgroundColor: 'green'},
  leaveButton: {backgroundColor: 'red'},
  closeButton: {
    backgroundColor: '#3e8e41',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    width: '48%',
  },
  buttonText: {
    color: 'white',
    fontSize: sizes.body,
    fontWeight: 'bold',
  },
  loading: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  error: {color: colors.red, fontSize: 18, textAlign: 'center', marginTop: 20},
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalDescription: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#e8f5e9',
    padding: 6,
    borderRadius: 6,
  },
  iconStyle: {marginRight: 10},
  modalDescriptionText: {
    fontSize: 16,
    flex: 1,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 8,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmButton: {
    backgroundColor: '#4CAF50',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f44336',
    padding: 12,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
});

export default EventDetailScreen;
