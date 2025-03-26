import React, {useRef, useState} from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from '../Icon';
import GroupTabs from './GroupTabs';
import {colors} from '../../constants/theme';
import {useNavigation} from '@react-navigation/native';
import Popover from 'react-native-popover-view';
import Divider from '../Divider';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { Alert } from 'react-native';


const GroupDetailScreen = ({route}) => {
  const {group} = route.params;
  const navigation = useNavigation();
  const [popoverVisible, setPopoverVisible] = useState(false);
  const filterButtonRef = useRef(); 
  const userEmail = auth().currentUser?.email;

  // console.log('Group', group);
  // console.log('Group', userEmail);

  const handleLeaveGroup = async () => {
    if (!userEmail) return;
  
    // Kiểm tra nếu người dùng là quản trị viên
    if (group.createdBy?.email === userEmail) {
      Alert.alert('Thông báo', 'Bạn là quản trị viên của nhóm, không thể rời nhóm.');
      return;
    }
  
    // Lọc danh sách thành viên, loại bỏ user hiện tại
    const updatedMembers = group.members.filter(member => member.email !== userEmail);
  
    // Nếu danh sách không thay đổi, nghĩa là user không phải là thành viên
    if (updatedMembers.length === group.members.length) {
      Alert.alert('Thông báo', 'Bạn không phải thành viên của nhóm.');
      return;
    }
  
    try {
      await firestore()
        .collection('GROUPS') // Đổi thành collection thực tế
        .doc(group.id)
        .update({
          members: updatedMembers,
        });
  
      console.log('Người dùng đã rời nhóm');
      setPopoverVisible(false);
      navigation.goBack();
    } catch (error) {
      console.error('Lỗi khi rời nhóm:', error);
      Alert.alert('Lỗi', 'Không thể rời nhóm, vui lòng thử lại sau.');
    }
  };

  const handleShareGroup = () => {
    console.log('Chia sẻ nhóm');
    setPopoverVisible(false);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon icon="Back" size={40} color="#fff" style={styles.backIcon} />
          </TouchableOpacity>
          <Text style={styles.groupName}>{group.groupName}</Text>
        </View>

        <TouchableOpacity
          ref={filterButtonRef}
          style={styles.filterIcon}
          onPress={() => setPopoverVisible(true)}>
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

      <Popover
        isVisible={popoverVisible}
        from={filterButtonRef}
        onRequestClose={() => setPopoverVisible(false)}
        placement="bottom"
        popoverStyle={styles.popoverContainer}>
        <TouchableOpacity style={styles.popoverItem} onPress={handleShareGroup}>
          <Text style={styles.popoverText}>📤 Chia sẻ nhóm</Text>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          style={[styles.popoverItem, {backgroundColor: 'white'}]}
          onPress={handleLeaveGroup}>
          <Text style={[styles.popoverText, {color: 'red'}]}>🚪 Rời nhóm</Text>
        </TouchableOpacity>
      </Popover>
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

  popoverContainer: {
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
    elevation: 5,
  },
  popoverItem: {
    marginTop: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'flex-start',
    borderRadius: 5,
    width: 200,
    marginBottom: 5,
  },
  popoverText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default GroupDetailScreen;
