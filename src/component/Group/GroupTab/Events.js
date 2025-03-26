import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import Icon from '../../Icon';

const Events = ({group}) => {
  const [userEmail, setUserEmail] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const currentUser = auth().currentUser;
    if (currentUser) {
      setUserEmail(currentUser.email);
    }
  }, []);

  useEffect(() => {
    if (!group?.id) return;

    const unsubscribe = firestore()
      .collection('EVENTS_GROUPS')
      .where('groupId', '==', group.id)
      .orderBy('date', 'asc')
      .onSnapshot(
        snapshot => {
          if (snapshot.empty) {
            setEvents([]);
            setLoading(false);
            return;
          }

          const eventsList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            date: doc.data().date?.toDate(),
            startTime: doc.data().startTime?.toDate(),
            endTime: doc.data().endTime?.toDate(),
          }));

          setEvents(eventsList);
          setLoading(false);
        },
        error => {
          console.error('Error fetching events:', error);
          setLoading(false);
        },
      );

    return () => unsubscribe();
  }, [group?.id]);

  const isOwner = userEmail && group?.createdBy?.email === userEmail;

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('vi-VN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (time) => {
    if (!time) return '';
    return time.toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const navigateToEventDetail = (eventId) => {
    navigation.navigate('EventDetailScreen', { eventId });
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingEvents = events.filter(event => event.date >= today);
  const pastEvents = events.filter(event => event.date < today);

  const renderEventItem = ({item}) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => navigateToEventDetail(item.id)}>
      {item.coverImageUrl ? (
        <Image
          source={{ uri: item.coverImageUrl || '' }}
          style={styles.eventImage}
          resizeMode="cover"
          onError={() => console.log("Error loading image")}
        />
      ) : (
        <View style={styles.eventImagePlaceholder}>
          <Icon
            icon={item.eventType === 'Dọn dẹp' ? 'trash' : 'people'}
            size={30}
            color="#28a745"
          />
        </View>
      )}

      <View style={styles.eventContent}>
        <Text style={styles.eventType}>
          Loại sự kiện: {item.eventType === 'Dọn dẹp' ? ' Dọn dẹp' : ' Workshop'}
        </Text>
        <Text style={styles.eventName} numberOfLines={1}>
          {item.eventName}
        </Text>

        <View style={styles.eventDetail}>
          <Icon icon="calendar" size={14} color="#666" />
          <Text style={styles.eventDetailText}>{formatDate(item.date)}</Text>
        </View>

        <View style={styles.eventDetail}>
          <Icon icon="calendar" size={14} color="#666" />
          <Text style={styles.eventDetailText}>
            {formatTime(item.startTime)} - {formatTime(item.endTime)}
          </Text>
        </View>

        <View style={styles.eventDetail}>
          <Icon icon="Shipper" size={20} color="#666" />
          <Text style={styles.eventDetailText} numberOfLines={1}>
            {item.location}
          </Text>
        </View>

        <View style={styles.participants}>
          <Text style={styles.participantsText}>
            {item.members?.length || 0} người tham gia
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon icon="calendar" size={50} color="#ddd" />
      <Text style={styles.emptyText}>Chưa có sự kiện nào</Text>
      {isOwner && (
        <TouchableOpacity 
          style={styles.createEmptyButton}
          onPress={() => navigation.navigate('CreateEvent', {groupId: group.id})}>
          <Text style={styles.createEmptyButtonText}>Tạo sự kiện đầu tiên</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.scene}>
      <View style={styles.header}>
        <Text style={styles.title}>Các sự kiện sắp tới</Text>
        {isOwner && (
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('CreateEvent', {groupId: group.id})}>
            <Text style={styles.createButtonText}>Tạo</Text>
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#28a745" />
          <Text style={styles.loadingText}>Đang tải sự kiện...</Text>
        </View>
      ) : (
        <ScrollView>
          {upcomingEvents.length > 0 && (
            <>
              <FlatList
                data={upcomingEvents}
                keyExtractor={item => item.id}
                renderItem={renderEventItem}
                scrollEnabled={false}
                ListEmptyComponent={renderEmptyComponent}
              />
            </>
          )}

          {pastEvents.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>Các sự kiện đã qua</Text>
              <FlatList
                data={pastEvents}
                keyExtractor={item => item.id}
                renderItem={renderEventItem}
                scrollEnabled={false}
              />
            </>
          )}

          {upcomingEvents.length === 0 && pastEvents.length === 0 && renderEmptyComponent()}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  scene: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212529',
  },
  createButton: {
    backgroundColor: '#28a745',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#6c757d',
  },
  eventCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 15,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  eventImage: {
    height: 120,
    width: '100%',
  },
  eventImagePlaceholder: {
    height: 120,
    width: '100%',
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  eventContent: {
    padding: 12,
  },
  eventType: {
    fontSize: 12,
    color: '#28a745',
    fontWeight: 'bold',
    marginBottom: 5,
  },
  eventName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginBottom: 8,
  },
  eventDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  eventDetailText: {
    fontSize: 13,
    color: '#6c757d',
    marginLeft: 8,
  },
  participants: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  participantsText: {
    fontSize: 12,
    color: '#6c757d',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 50,
  },
  emptyText: {
    marginTop: 10,
    color: '#6c757d',
    fontSize: 16,
    marginBottom: 20,
  },
  createEmptyButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  createEmptyButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212529',
    marginTop: 15,
    marginBottom: 10,
  },
});

export default Events;