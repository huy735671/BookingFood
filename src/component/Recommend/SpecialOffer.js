import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const SpecialOffer = ({navigation}) => {
  const [userData, setUserData] = useState(null);
  const [eventCount, setEventCount] = useState(0);
  const [groupCount, setGroupCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth().currentUser;
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        const userDoc = await firestore()
          .collection('users')
          .doc(currentUser.email)
          .get();
        if (userDoc.exists) {
          setUserData(userDoc.data());
        }

        const eventQuery = await firestore()
          .collection('HISTORY_EVENTS')
          .where('email', '==', currentUser.email)
          .get();
        setEventCount(eventQuery.size);

        const groupQuery = await firestore().collection('GROUPS').get();
        const userGroups = groupQuery.docs.filter(doc => {
          const data = doc.data();
          const members = data.members || [];
          const createdBy = data.createdBy?.email || '';

          return (
            members.some(
              member =>
                member.email.toLowerCase() === currentUser.email.toLowerCase(),
            ) || createdBy.toLowerCase() === currentUser.email.toLowerCase()
          );
        });

        setGroupCount(userGroups.length);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <TouchableOpacity
        style={styles.offerContainer}
        onPress={() => ({})}>
        <View style={styles.offerContent}>
          <Text style={styles.offerSubtitle}>{eventCount}</Text>
          <Text style={styles.offerTitle}>Sự kiện đã tham gia</Text>
        </View>

        <View style={styles.offerContent}>
          <Text style={styles.offerSubtitle}>{groupCount}</Text>
          <Text style={styles.offerTitle}>Nhóm đã tham gia</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  offerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  offerContent: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  offerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  offerSubtitle: {
    fontSize: 18,
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 5,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SpecialOffer;
