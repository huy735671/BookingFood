import {useNavigation} from '@react-navigation/native';
import React, {useState, useEffect} from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  StatusBar,
  View,
} from 'react-native';
import {colors, sizes} from '../../constants/theme';
import firestore from '@react-native-firebase/firestore';

const EventBanner = () => {
  const navigation = useNavigation();
  const [eventData, setEventData] = useState({
    image:
      'https://cdn-i.vtcnews.vn/resize/ma/upload/2022/09/24/bien-dep-23474591.jpg',
    eventTitle: 'Sự kiện đang hoạt động',
    eventDate: 'Ngày dọn dẹp Trái Đất',
    description: 'Hãy tham gia cùng chúng tôi để dọn dẹp bãi biển địa phương.',
  });

 

  return (
    <ScrollView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor="#4c8d6e"
      />
      <ImageBackground
        source={{uri: eventData.image}}
        style={styles.bannerImage}>
        <View style={styles.textContainer}>
          <Text style={styles.eventTitle}>{eventData.eventTitle}</Text>
        </View>
        <Text style={styles.eventDate}>{eventData.eventDate}</Text>

        <Text style={styles.eventDescription}>{eventData.description}</Text>
      </ImageBackground>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    justifyContent: 'flex-end',
    borderRadius: 15,
    overflow: 'hidden',
    marginBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  eventTitle: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
    marginLeft: 5,
  },
  textContainer: {
    backgroundColor: colors.green,
    paddingVertical: 5,
    paddingHorizontal:5,
    borderRadius: 20,
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  eventDate: {
    fontSize: sizes.body,
    marginLeft: 5,
    color: '#fff',
    marginBottom: 10,
    fontStyle: 'italic',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
  eventDescription: {
    fontSize: sizes.body,
    marginLeft: 5,
    color: '#fff',
    marginBottom: 15,
    fontStyle: 'italic',
    textShadowColor: '#000',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 3,
  },
});

export default EventBanner;
