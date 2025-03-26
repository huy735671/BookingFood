import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import { colors, sizes } from '../constants/theme';
import FeaturedGroup from '../component/Group/FeaturedGroup';
import GroupList from '../component/Group/GroupList';
import Icon from '../component/Icon';
import { useNavigation } from '@react-navigation/native';

const PeopleScreen = () => {
  const navigation = useNavigation();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('GROUPS')
      .onSnapshot(snapshot => {
        const groupData = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setGroups(groupData);
        setLoading(false);
      });

    return () => unsubscribe(); // Cleanup listener khi component unmount
  }, []);

  const handleCreateGroup = () => {
    navigation.navigate('CreateGroupScreen');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.green} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Hội nhóm</Text>
        <TouchableOpacity onPress={handleCreateGroup}>
          <Icon icon="Add" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon icon="Search" size={20} color={colors.gray} />
        <TextInput placeholder="Tìm kiếm nhóm..." style={styles.searchInput} />
      </View>

      {groups.length > 0 && (
        <>
          <Text style={styles.bannerText}>Nhóm nổi bật</Text>
          <FeaturedGroup groups={groups} />
        </>
      )}

      <Text style={styles.bannerText}>Tất cả nhóm</Text>
      <GroupList groups={groups} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f5f5f5'},
  header: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: colors.green,
  },
  title: {color: 'white', fontSize: 18, fontWeight: 'bold'},
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  searchInput: {flex: 1, paddingVertical: 8},
  bannerText: {
    padding: 5,
    marginLeft: 5,
    color: colors.green,
    fontWeight: 'bold',
    fontSize: sizes.h3,
  },
});

export default PeopleScreen;
