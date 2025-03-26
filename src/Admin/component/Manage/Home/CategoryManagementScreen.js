import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import Icon from '../../../../component/Icon';
import {colors, sizes} from '../../../../constants/theme';

const CategoryManagementScreen = () => {
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('EVENTS')
      .onSnapshot(snapshot => {
        const eventList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        setEvents(eventList);
        setLoading(false);
      });

    return () => unsubscribe();
  }, []);

  // 🔍 3. Lọc sự kiện theo tìm kiếm
  const filteredEvents = events.filter(event =>
    event.eventName?.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm sự kiện..."
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CreateEventScreen')}>
          <Text style={styles.addButtonText}>+ Thêm sự kiện</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách sự kiện */}
      <FlatList
        data={filteredEvents}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.eventItem}>
            <Text style={styles.eventName}>{item.eventName}</Text>
            <TouchableOpacity
              style={styles.editButton}
              onPress={() =>
                navigation.navigate('CreateEventScreen', {event: item})
              }>
              <Icon icon="edit" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  searchInput: {
    flex: 1,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
  },
  addButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: colors.green,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: sizes.h4,
  },
  eventItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginBottom: 8,
  },
  eventName: {
    fontSize: sizes.h4,
    color: colors.dark,
  },
  editButton: {
    padding: 5,
  },
});

export default CategoryManagementScreen;
