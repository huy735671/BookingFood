import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import Icon from './Icon';
import { colors, sizes, spacing } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const MainHeader = ({ title }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { marginTop: insets.top }]}>
      <View style={styles.shipperContainer}>
        <Icon icon="leaf" size={40} color={colors.light} style={styles.shipperIcon} />
        <Text style={styles.locationText}>EcoWarriors</Text>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Icon icon="Notification" size={40} color={colors.light} onPress={() => {}} />

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
    backgroundColor: colors.green,
  },
  shipperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shipperIcon: {
    transform: [{ scaleX: -1 }],
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    color: colors.dark,
    marginHorizontal: 5,
    fontSize: sizes.h3,
    fontWeight: 'bold',
    color: colors.light,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
  },
});
