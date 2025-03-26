import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from '../../Icon';
import {colors, sizes} from '../../../constants/theme';
import EventDetailTab from './TabEvent/EventDetailTab';
import ParticipantsTab from './TabEvent/ParticipantsTab';
import DiscussionTab from './TabEvent/DiscussionTab';

const TABS = {
  DETAILS: 'DETAILS',
  PARTICIPANTS: 'PARTICIPANTS',
  DISCUSSION: 'DISCUSSION',
};

const EventDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {event} = route.params;
  const [activeTab, setActiveTab] = useState(TABS.DETAILS);
  const [user, setUser] = useState(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isEventPassed, setIsEventPassed] = useState(false);

  const [isCompletionModalVisible, setIsCompletionModalVisible] = useState(false);
  const [completionCode, setCompletionCode] = useState('');

  useEffect(() => {
    // Kiểm tra ngày sự kiện
    const checkEventDate = () => {
      // Chuyển đổi eventDate sang đối tượng Date nếu nó chưa phải
      const eventDate = event.eventDate instanceof Date 
        ? event.eventDate 
        : new Date(event.eventDate);
      
      const currentDate = new Date();
      
      // So sánh ngày sự kiện với ngày hiện tại
      const isPassed = eventDate <= currentDate;
      setIsEventPassed(isPassed);

      console.log('Event Date:', eventDate);
      console.log('Current Date:', currentDate);
      console.log('Is Event Passed:', isPassed);
    };

    checkEventDate();
  }, [event.eventDate]);

  const handleEventCompletion = () => {
    // Mở modal nhập mã xác nhận
    setIsCompletionModalVisible(true);
  };

  const verifyCompletionCode = async () => {
    if (!user) {
      Alert.alert('Lỗi', 'Vui lòng đăng nhập để tiếp tục.');
      return;
    }
  
    const isUserMember = event.members?.some(member => member.email === user.email);
    if (!isUserMember) {
      Alert.alert('Thông báo', 'Bạn không phải là thành viên của sự kiện này.');
      return;
    }
  
    try {
      // Kiểm tra xem người dùng đã hoàn thành sự kiện chưa
      const historyRef = firestore()
        .collection('HISTORY_EVENTS')
        .where('eventId', '==', event.id)
        .where('email', '==', user.email);
      
      const historySnapshot = await historyRef.get();
      
      if (!historySnapshot.empty) {
        Alert.alert('Thông báo', 'Bạn đã hoàn thành sự kiện này trước đó và không thể nhập mã lại.');
        return;
      }
  
      // Kiểm tra mã xác nhận
      if (completionCode.trim() === event.confirmationCode) {
        // Lưu thông tin hoàn thành vào Firestore
        await firestore().collection('HISTORY_EVENTS').add({
          eventId: event.id,
          completedAt: firestore.Timestamp.now(),
          email: user.email,
          completionPoints: event.completionPoints || 0
        });
  
        // Cập nhật điểm người dùng
        const userPointsRef = firestore().collection('USER_POINTS').where('email', '==', user.email);
        const userPointsSnapshot = await userPointsRef.get();
  
        if (!userPointsSnapshot.empty) {
          const userPointsDoc = userPointsSnapshot.docs[0];
          await firestore().collection('USER_POINTS').doc(userPointsDoc.id).update({
            points: firestore.FieldValue.increment(event.completionPoints || 0)
          });
        } else {
          await firestore().collection('USER_POINTS').add({
            email: user.email,
            points: event.completionPoints || 0
          });
        }
  
        setIsCompletionModalVisible(false);
        Alert.alert('Hoàn thành', `Bạn đã nhận được ${event.completionPoints || 0} điểm.`);
      } else {
        Alert.alert('Lỗi', 'Mã xác nhận không chính xác.');
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra lịch sử sự kiện:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra. Vui lòng thử lại.');
    }
  };
  

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;
      if (currentUser) {
        const email = currentUser.email;
        try {
          const userSnapshot = await firestore()
            .collection('users')
            .where('email', '==', email)
            .get();

          if (!userSnapshot.empty) {
            const userDoc = userSnapshot.docs[0].data();
            setUser({
              id: userSnapshot.docs[0].id,
              fullName: userDoc.fullName,
              email: userDoc.email,
            });

            // Lấy danh sách thành viên mới nhất từ Firestore
            const eventRef = await firestore()
              .collection('EVENTS')
              .doc(event.id)
              .get();
            const updatedEvent = eventRef.data();

            // Kiểm tra xem người dùng đã đăng ký chưa
            const registeredCheck = updatedEvent?.members?.some(
              member => member.email === email,
            );
            setIsRegistered(registeredCheck);
          }
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu người dùng:', error);
        }
      }
    };

    fetchUserData();
  }, [event.id]); 

  const handleRegisterAction = async () => {
    if (!user) {
      Alert.alert('Thông báo', 'Bạn cần đăng nhập để thực hiện.');
      return;
    }

    // Nếu chưa đăng ký
    if (!isRegistered) {
      // Kiểm tra số lượng người tham gia
      if (event.members?.length >= event.maxParticipants) {
        Alert.alert(
          'Thông báo',
          'Sự kiện đã đạt số lượng người tham gia tối đa.',
        );
        return;
      }

      // Xác nhận đăng ký
      Alert.alert(
        'Xác nhận',
        'Bạn có chắc chắn muốn đăng ký tham gia sự kiện này không?',
        [
          {text: 'Hủy', style: 'cancel'},
          {text: 'Đồng ý', onPress: registerUser},
        ],
      );
    }
    // Nếu đã đăng ký
    else {
      // Xác nhận hủy đăng ký
      Alert.alert(
        'Xác nhận',
        'Bạn có chắc chắn muốn hủy đăng ký sự kiện này không?',
        [
          {text: 'Không', style: 'cancel'},
          {text: 'Có', onPress: unregisterUser},
        ],
      );
    }
  };

  const registerUser = async () => {
    try {
      const newMember = {
        email: user.email,
        fullName: user.fullName,
        registrationDate: firestore.Timestamp.now(),
      };

      await firestore()
        .collection('EVENTS')
        .doc(event.id)
        .update({
          members: firestore.FieldValue.arrayUnion(newMember),
        });

      setIsRegistered(true);
      Alert.alert('Thành công', 'Bạn đã đăng ký tham gia sự kiện.');
    } catch (error) {
      console.error('Lỗi khi đăng ký sự kiện:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi đăng ký. Vui lòng thử lại.');
    }
  };

  const unregisterUser = async () => {
    try {
      const eventRef = firestore().collection('EVENTS').doc(event.id);
      const eventDoc = await eventRef.get();

      if (eventDoc.exists) {
        const members = eventDoc.data().members || [];
        const updatedMembers = members.filter(
          member => member.email !== user.email,
        );

        await eventRef.update({members: updatedMembers});

        setIsRegistered(false);
        Alert.alert('Thông báo', 'Bạn đã hủy đăng ký sự kiện.');
      }
    } catch (error) {
      console.error('Lỗi khi hủy đăng ký sự kiện:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi hủy đăng ký. Vui lòng thử lại.');
    }
  };

  const handleConfirmation = () => {
    // Logic xác nhận tham gia sự kiện sau khi sự kiện đã diễn ra
    if (!user) {
      Alert.alert('Thông báo', 'Bạn cần đăng nhập để thực hiện.');
      return;
    }

    // Kiểm tra xem người dùng có trong danh sách members không
    const isUserMember = event.members?.some(
      member => member.email === user.email
    );

    if (!isUserMember) {
      Alert.alert('Thông báo', 'Bạn không phải là thành viên của sự kiện này.');
      return;
    }

    // Thêm logic xác nhận tham gia ở đây
    Alert.alert('Xác nhận', 'Bạn đã tham gia sự kiện này.');
  };

  const renderContent = () => {
    switch (activeTab) {
      case TABS.DETAILS:
        return <EventDetailTab event={event} />;
      case TABS.PARTICIPANTS:
        return <ParticipantsTab event={event} user={user} />;
      case TABS.DISCUSSION:
        return <DiscussionTab event={event} user={user} />;
      default:
        return <EventDetailTab event={event} />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <View>
        <Image source={{uri: event.image}} style={styles.eventImage} />
        <View style={styles.eventNameContainerType}>
          <Text style={styles.eventTypeText}>{event.eventType}</Text>
        </View>
        <View style={styles.eventNameContainer}>
          <Text style={styles.eventName}>{event.eventName}</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}>
        <Icon icon="Back" size={24} color="#fff" />
      </TouchableOpacity>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab(TABS.DETAILS)}>
          <Text
            style={
              activeTab === TABS.DETAILS ? styles.activeTabText : styles.tabText
            }>
            Chi tiết
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab(TABS.PARTICIPANTS)}>
          <Text
            style={
              activeTab === TABS.PARTICIPANTS
                ? styles.activeTabText
                : styles.tabText
            }>
            Người tham gia
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => setActiveTab(TABS.DISCUSSION)}>
          <Text
            style={
              activeTab === TABS.DISCUSSION
                ? styles.activeTabText
                : styles.tabText
            }>
            Thảo luận
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>{renderContent()}</View>

      {!isEventPassed && activeTab !== TABS.DISCUSSION && (
        <TouchableOpacity
          style={[
            styles.registerButton,
            {backgroundColor: isRegistered ? colors.gray : colors.green},
          ]}
          onPress={handleRegisterAction}>
          <Text style={styles.registerButtonText}>
            {isRegistered ? 'Đã đăng ký' : 'Đăng ký tham gia'}
          </Text>
        </TouchableOpacity>
      )}


<Modal
        animationType="slide"
        transparent={true}
        visible={isCompletionModalVisible}
        onRequestClose={() => setIsCompletionModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Nhập mã xác nhận</Text>
            <TextInput
              style={styles.input}
              placeholder="Nhập mã xác nhận"
              value={completionCode}
              onChangeText={setCompletionCode}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.button, styles.buttonClose]}
                onPress={() => setIsCompletionModalVisible(false)}
              >
                <Text style={styles.textStyle}>Hủy</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.buttonConfirm]}
                onPress={verifyCompletionCode}
              >
                <Text style={styles.textStyle}>Xác nhận</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {isEventPassed && (
  <TouchableOpacity
    style={styles.confirmButton}
    onPress={handleEventCompletion}> 
    <Text style={styles.confirmButtonText}>Hoàn thành sự kiện</Text>
  </TouchableOpacity>
)}



    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  eventImage: {
    width: '100%',
    height: 250,
  },
  eventNameContainerType: {
    position: 'absolute',
    bottom: 60,
    left: 10,
    backgroundColor: colors.green,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 40,
  },
  eventTypeText: {
    fontWeight: 'bold',
    fontSize: sizes.body,
    color: colors.light,
  },
  eventNameContainer: {
    position: 'absolute',
    bottom: 20,
    left: 10,
  },
  eventName: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    color: colors.light,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 50,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: {
    padding: 10,
  },
  tabText: {
    fontSize: 16,
    color: '#555',
  },
  activeTabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.green,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  registerButton: {
    backgroundColor: colors.green,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  registerButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  confirmButton: {
    backgroundColor: colors.green,
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    margin: 20,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '45%',
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: colors.gray,
  },
  buttonConfirm: {
    backgroundColor: colors.green,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EventDetails;