import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';

const GiftManage = () => {
  const [gifts, setGifts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    const unsubscribe = firestore().collection('GIFTS').onSnapshot(snapshot => {
      const giftList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setGifts(giftList);
    });
    return () => unsubscribe();
  }, []);

  const filteredGifts = gifts.filter(gift => 
    gift.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm quà..."
          value={searchText}
          onChangeText={setSearchText}
        />
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CreateGiftScreen')}>
          <Icon name="plus" size={20} color="white" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={filteredGifts}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.giftItem}>
            <Text style={styles.giftName}>{item.name}</Text>
            <Text style={styles.giftPoints}>{item.points} điểm</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchInput: { flex: 1, padding: 10 },
  addButton: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  giftItem: { padding: 15, backgroundColor: '#f0f0f0', marginVertical: 5, borderRadius: 5 },
  giftName: { fontSize: 16, fontWeight: 'bold' },
  giftPoints: { fontSize: 14, color: 'gray' },
});

export default GiftManage;