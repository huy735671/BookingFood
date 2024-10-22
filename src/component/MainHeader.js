import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import Icon from './Icon';
import {colors, shadow, sizes, spacing} from '../constants/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const MainHeader = ({title, userLocation}) => {
  const insets = useSafeAreaInsets();

  const limitWords = (text, limit) => {
    const words = text.split(' ');
    return words.length > limit ? words.slice(0, limit).join(' ') + '...' : text;
  };

  const limitedLocation = limitWords(userLocation, 5);

  return (
    <View style={[styles.container, {marginTop: insets.top}]}>
      <View style={styles.shipperContainer}>
        <Icon
          icon="Shipper"
          size={40}
          color={colors.dark} 
          style={styles.shipperIcon}
        />
        <Text style={styles.locationText}>{limitedLocation}</Text>
        <TouchableOpacity style={styles.locationButton}>
          <Text style={styles.locationButtonText}>V</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Icon
        icon="Notification"
        size={40}
        color={colors.dark} 
        onPress={() => {}}
      />
    </View>
  );
};

export default MainHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    backgroundColor: '#fff',
    paddingVertical: spacing.s,
    elevation: 3,
    
  },
  shipperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shipperIcon: {
    transform: [{ scaleX: -1 }], 
  },
  locationText: {
    color: colors.dark,
    marginHorizontal: 5, 
  },
  title: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.dark,
  },
  locationButton: {
    backgroundColor: colors.light,
    borderRadius: 5,
    padding: 5,
  },
  locationButtonText: {
    color: colors.dark, 
    fontWeight: 'bold',
  },
});
