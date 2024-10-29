import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Tab = ({ title, onPress, isActive }) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.tab, isActive && styles.activeTab]}>
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  tab: {
    padding: 15,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: 'blue', 
  },
  tabText: {
    color: 'black',
  },
  activeTabText: {
    fontWeight: 'bold', 
  },
});

export default Tab;
