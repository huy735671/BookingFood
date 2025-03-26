import {useNavigation} from '@react-navigation/native';
import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import Icon from '../Icon';
import {sizes} from '../../constants/theme';

const windowWidth = Dimensions.get('window').width;

const PopularDishes = ({dishes}) => {
  const [pressedIndex, setPressedIndex] = useState(null);
  const navigation = useNavigation();

  const handlePress = event => {
    navigation.navigate('EventDetails', {event});
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {dishes.map((event, index) => (
          <TouchableOpacity
            key={event.id}
            style={[
              styles.dishCard,
              pressedIndex === index && styles.pressedCard,
            ]}
            onPressIn={() => setPressedIndex(index)}
            onPressOut={() => setPressedIndex(null)}
            onPress={() => handlePress(event)}>
            <Image source={{uri: event.image}} style={styles.dishImage} />
            <View style={styles.dishInfo}>
              <Text
                style={styles.dishName}
                numberOfLines={1}
                ellipsizeMode="tail">
                {event.eventName}
              </Text>
              <View style={{flexDirection: 'row'}}>
                <Icon icon="Location" size={20} color="#4c8d6e" />
                <Text style={styles.dishPrice}>{event.location}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon icon="calendar" size={20} color="#4c8d6e" />
                <Text style={styles.dishPrice}>
                  {event.eventDate
                    ? new Date(event.eventDate).toLocaleDateString('vi-VN')
                    : 'Chưa có ngày'}
                </Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon icon="people" size={20} color="#4c8d6e" />
                <Text style={styles.dishPrice}>
                  {event.members ? event.members.length : 0} người tham gia
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    paddingBottom: 10,
  },
  container: {
    flexDirection: 'column',
  },
  dishCard: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 15,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  pressedCard: {
    transform: [{scale: 0.98}],
    shadowOpacity: 0.1,
  },
  dishImage: {
    width: windowWidth * 0.25,
    height: windowWidth * 0.25,
    borderRadius: 12,
  },
  dishInfo: {
    marginLeft: 15,
    flex: 1,
    justifyContent: 'center',
  },
  dishName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4c8d6e',
    marginBottom: 5,
  },
  dishPrice: {
    fontSize: sizes.body,
    marginBottom: 5,
    marginLeft: 5,
  },
});

export default PopularDishes;
