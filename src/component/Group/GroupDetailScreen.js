import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '../Icon';
import GroupTabs from './GroupTabs'; // Import GroupTabs
import {colors} from '../../constants/theme';
import {useNavigation} from '@react-navigation/native';

const GroupDetailScreen = ({route}) => {
  const {group} = route.params;
  navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon icon="Back" size={40} color="#fff" style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.groupName}>{group.groupName}</Text>
        </View>

        <TouchableOpacity style={styles.filterIcon}>
          <Icon icon="Filter" size={40} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* Ảnh nhóm và thông tin chung */}
      <View style={styles.imageContainer}>
        <Image source={{uri: group.groupImage}} style={styles.groupImage} />
        <View style={styles.textOverlay}>
          <Text style={styles.groupName}>{group.groupName}</Text>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon icon="people" size={18} color="#fff" />
            <Text style={styles.groupMembers}>
              {group.members?.length || 0} Thành viên
            </Text>
            <Icon
              icon="Location"
              size={20}
              color="#fff"
              style={{marginLeft: 10}}
            />
            <Text style={styles.groupLocation}>{group.location}</Text>
          </View>
        </View>
      </View>

      {/* Tab View */}
      <View style={{flex: 1}}>
        <GroupTabs group={group} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#fff'},
  header: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.green,
    marginTop: 40,
  },
  backIcon: {
    marginRight: 10,
  },
  filterIcon: {
    marginRight: 20,
  },
  imageContainer: {position: 'relative', width: '100%', height: 200},
  groupImage: {width: '100%', height: '100%'},
  textOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 8,
    borderRadius: 5,
  },
  groupName: {fontSize: 18, fontWeight: 'bold', color: '#fff'},
  groupMembers: {marginLeft: 5, fontSize: 14, color: '#ddd'},
  groupLocation: {fontSize: 14, color: '#ddd'},
});

export default GroupDetailScreen;
