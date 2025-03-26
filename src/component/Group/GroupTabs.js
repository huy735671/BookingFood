import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, ScrollView } from 'react-native';
import Introduction from './GroupTab/Introduction';
import Events from './GroupTab/Events';
import Members from './GroupTab/Members';
import Activities from './GroupTab/Activities';


const GroupTabs = ({ group }) => {
  const [selectedTab, setSelectedTab] = useState('introduction');
  const tabIndicator = new Animated.Value(0);

  const tabs = [
    { key: 'introduction', label: 'Giới thiệu' },
    { key: 'events', label: 'Sự kiện' },
    { key: 'members', label: 'Thành viên' },
    { key: 'activities', label: 'Hoạt động' },
  ];

  const renderContent = () => {
    switch (selectedTab) {
      case 'introduction':
        return <Introduction group={group} />;
      case 'events':
        return <Events  group={group}/>;
      case 'members':
        return <Members group={group}/>;
      case 'activities':
        return <Activities group={group}/>;
      default:
        return null;
    }
  };

  const handleTabPress = (index, key) => {
    setSelectedTab(key);
    Animated.spring(tabIndicator, {
      toValue: index * 100, 
      useNativeDriver: false,
    }).start();
  };

  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        {tabs.map((tab, index) => (
          <TouchableOpacity key={tab.key} style={styles.tabButton} onPress={() => handleTabPress(index, tab.key)}>
            <Text style={[styles.tabText, selectedTab === tab.key && styles.activeTabText]}>{tab.label}</Text>
            {selectedTab === tab.key && <View style={styles.underline} />}  
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView style={styles.content}>{renderContent()}</ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tabButton: { alignItems: 'center', paddingVertical: 8 },
  tabText: { fontSize: 16, fontWeight: '500', color: '#666' },
  activeTabText: { color: '#000', fontWeight: 'bold' },
  underline: { width: '80%', height: 3, backgroundColor: '#007bff', marginTop: 4, borderRadius: 2 },
  content: { flex: 1 },
});

export default GroupTabs;
