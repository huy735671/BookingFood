import React , { useEffect, useState } from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {ProgressBar} from 'react-native-paper'; // Thay thế ProgressBarAndroid
import Icon from '../../../Icon';
import {colors, sizes} from '../../../../constants/theme';
import {format} from 'date-fns';
import firestore from '@react-native-firebase/firestore';

const EventDetailTab = ({event}) => {
  const formatDateTime = dateTime => {
    return format(new Date(dateTime), 'HH:mm');
  };

  const [participants, setParticipants] = useState(event.members ? event.members.length : 0);
  const maxParticipants = event.maxParticipants ?? 20;
  const participationRate = Math.min(participants / maxParticipants, 1);



  useEffect(() => {
    const unsubscribe = firestore()
      .collection('EVENTS') // Thay bằng tên collection của bạn
      .doc(event.id) // ID của sự kiện
      .onSnapshot(snapshot => {
        if (snapshot.exists) {
          const updatedEvent = snapshot.data();
          setParticipants(updatedEvent.members ? updatedEvent.members.length : 0);
        }
      });
  
    return () => unsubscribe(); // Cleanup khi component unmount
  }, [event.id]);


  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Ngày tổ chức */}
      <View style={styles.row}>
        <View style={styles.icon}>
          <Icon icon="calendar" size={30} color={colors.green} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Ngày</Text>
          <Text style={styles.eventDetail}>
            {event.eventDate
              ? new Date(event.eventDate).toLocaleDateString('vi-VN')
              : 'Chưa có ngày'}
          </Text>
        </View>
      </View>

      {/* Thời gian */}
      <View style={styles.row}>
        <View style={styles.icon}>
          <Icon icon="clock" size={30} color={colors.green} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Thời gian</Text>
          <Text style={styles.eventDetail}>
            {formatDateTime(event.startTime)} - {formatDateTime(event.endTime)}
          </Text>
        </View>
      </View>

      {/* Địa điểm */}
      <View style={styles.row}>
        <View style={styles.icon}>
          <Icon icon="Location" size={30} color={colors.green} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Địa điểm</Text>
          <Text style={styles.eventDetail}>{event.location}</Text>
        </View>
      </View>

      {/* Người tổ chức */}
      <View style={styles.row}>
        <View style={styles.icon}>
          <Icon icon="User" size={30} color={colors.green} />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.titleText}>Tổ chức bởi</Text>
          <Text style={styles.eventDetail}>{event.organizer}</Text>
        </View>
      </View>

      {/* Thanh tiến độ người tham gia */}
      <View style={styles.separator} />
      <View style={[styles.row, styles.participantContainer]}>
        <View style={styles.titleContainer}>
          <View style={styles.titleContainerPeople}>
            <Text style={styles.titleText}>Người tham gia</Text>
            <Text>
              {participants} / {maxParticipants}
            </Text>
          </View>
          <ProgressBar
            progress={participationRate}
            color={colors.green}
            style={styles.progressBar}
          />
        </View>
      </View>


      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptiontitle}>Mô tả sự kiện</Text>
        <Text style={styles.descriptionText}>{event.description}</Text>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptiontitle}>Yêu cầu</Text>
        <View style={{flexDirection: 'row'}}>
          <Icon
            icon="checked"
            size={20}
            color={colors.green}
            style={styles.iconTick}
          />
          <Text style={styles.bodyText}>{event.itemsToBring}</Text>
        </View>
      </View>

      <View style={styles.descriptionContainer}>
        <Text style={styles.descriptiontitle}>Lợi ích khi tham gia</Text>
        <View style={{flexDirection: 'row'}}>
          <Icon
            icon="checked"
            size={20}
            color={colors.green}
            style={styles.iconTick}
          />
          <Text style={styles.bodyText}>
            Bú ngay cho mình {event.completionPoints} điểm EcoWarriors
          </Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Icon
            icon="checked"
            size={20}
            color={colors.green}
            style={styles.iconTick}
          />
          <Text style={styles.bodyText}>Được cấp giấy chứng nhận tham gia</Text>
        </View>
        <View style={{flexDirection: 'row'}}>
          <Icon
            icon="checked"
            size={20}
            color={colors.green}
            style={styles.iconTick}
          />
          <Text style={styles.bodyText}>Bữa cơm miễn phí sau sự kiện</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 6,
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'column',
    marginLeft: 10,
  },
  titleText: {
    fontSize: sizes.body,
    color: colors.gray,
  },
  eventDetail: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: 'bold',
  },
  titleContainerPeople: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  icon: {
    borderRadius: 40,
    padding: 3,
    backgroundColor: '#e8f5e9',
  },
  progressBar: {
    marginTop: 5,
    width: 300,
    height: 10,
    borderRadius: 20,
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 10,
  },
  participantContainer: {
    paddingVertical: 10,
  },
  descriptionContainer: {
    borderTopWidth: 1,
    marginTop: 5,
    borderColor: '#ddd',
  },

  descriptiontitle: {
    fontWeight: 'bold',
    marginTop: 10,
    color: colors.green,
    fontSize: sizes.h3,
  },
  bodyText: {
    fontSize: sizes.body,
    color: colors.primary,
    marginVertical:5,
  },
  descriptionText: {
    fontSize: sizes.body,
    color: colors.gray,
  },
  iconTick: {
    marginRight: 5,
    marginVertical:5,

  },
});

export default EventDetailTab;
