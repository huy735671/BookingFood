import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  StyleSheet,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const UpcomingEventsScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('EVENTS')
      .onSnapshot(snapshot => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Đưa thời gian về đầu ngày

        const eventList = snapshot.docs
          .map(doc => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter(event => new Date(event.eventDate) > today); // Lọc các sự kiện có eventDate > hôm nay

        setEvents(eventList);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  const filteredEvents = events.filter(event =>
    event.eventName?.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      {/* Thanh tiêu đề */}
      <View style={styles.header}>
        <Text style={styles.title}>Sự kiện sắp tới</Text>
      </View>

      {/* Ô tìm kiếm */}
      <TextInput
        style={styles.searchBox}
        placeholder="Tìm kiếm sự kiện..."
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* Danh sách sự kiện */}
      <ScrollView style={styles.eventList}>
        {filteredEvents.length > 0 ? (
          filteredEvents.map(item => (
            <View key={item.id} style={styles.eventCard}>
              <Image
                source={{uri: item.image || 'https://via.placeholder.com/60'}}
                style={styles.eventImage}
              />
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{item.eventName}</Text>

                <Text style={styles.eventDate}>
                  📅
                  {item?.eventDate
                    ? new Date(item.eventDate).toLocaleDateString('vi-VN')
                    : 'Chưa xác định'}
                </Text>

                <Text style={styles.eventParticipants}>
                  👥 {item.participants || 0} người tham gia
                </Text>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() =>
                    navigation.navigate('CreateEventScreen', {event: item})
                  }>
                  <Text style={styles.manageText}>Quản lý ↗</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noEventText}>
            Không có sự kiện nào sắp diễn ra.
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9FAFB', paddingTop: 10},
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {fontSize: 18, fontWeight: 'bold'},
  searchBox: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  eventList: {flex: 1},
  eventCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  eventImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#E5E7EB',
    marginRight: 10,
  },
  eventInfo: {flex: 1},
  eventTitle: {fontSize: 16, fontWeight: 'bold', marginBottom: 3},
  eventDate: {fontSize: 14, color: '#6B7280'},
  eventParticipants: {fontSize: 14, color: '#6B7280', marginBottom: 5},
  manageButton: {paddingVertical: 6, paddingHorizontal: 10},
  manageText: {color: '#4CAF50', fontWeight: 'bold'},
  noEventText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 20,
  },
});

export default UpcomingEventsScreen;
