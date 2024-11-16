import React, {useState} from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from './Icon';
import {colors, sizes, spacing} from '../constants/theme';
import {useNavigation} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigation = useNavigation();

  const handleSearch = async () => {
    if (!searchQuery) return;
  
    try {
      const dishesRef = firestore().collection('dishes');
      const snapshot = await dishesRef
        .where('dishName', '>=', searchQuery)
        .where('dishName', '<=', searchQuery + '\uf8ff')
        .get();
  
      const filteredDishes = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      if (filteredDishes.length === 0) {
        const ownerSnapshot = await dishesRef
          .where('ownerEmail', '>=', searchQuery)
          .where('ownerEmail', '<=', searchQuery + '\uf8ff')
          .get();
  
        ownerSnapshot.forEach(doc => {
          filteredDishes.push({id: doc.id, ...doc.data()});
        });
      }
  
      // Truyền searchQuery qua SearchResults
      navigation.navigate('SearchResults', {dishes: filteredDishes, query: searchQuery});
    } catch (error) {
      console.error('Error searching dishes:', error);
    }
  };
  

  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.inner}>
        <TouchableOpacity
          style={styles.search}
          pointerEvents="none"
          onPress={handleSearch}>
          <Icon icon="Search" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Bạn muốn ăn gì?"
          placeholderTextColor={colors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: spacing.s - 10,
    paddingBottom: spacing.l / 1.5,
  },
  inner: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  search: {
    position: 'absolute',
    top: 1,
    right: 1,
    zIndex: 1,
    borderWidth: 1,
    padding: 9,
    borderRadius: sizes.radius,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  searchInput: {
    backgroundColor: '#ecefeb',
    paddingLeft: spacing.s,
    paddingRight: spacing.m,
    paddingVertical: spacing.m,
    borderRadius: sizes.radius,
    height: 54,
    flex: 1,
    elevation: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
});

export default SearchBar;
