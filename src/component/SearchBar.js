import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import Icon from './Icon';
import { colors, sizes, spacing } from '../constants/theme';

const SearchBar = () => {
  return (
    <View style={styles.searchBarContainer}>
      <View style={styles.inner}>
        <TouchableOpacity style={styles.search} pointerEvents="none">
          <Icon icon="Search" />
        </TouchableOpacity>
        <TextInput
          style={styles.searchInput}
          placeholder="Bạn muốn ăn gì?"
          placeholderTextColor={colors.gray}
        />
      </View>
    
    </View>
  );
};

const styles = StyleSheet.create({
  searchBarContainer: {
    paddingHorizontal: spacing.s -10,
    paddingBottom: spacing.l / 1.5,
  },
  inner: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  searchTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
  },
  search: {
    position: 'absolute',
    top: 1,
    right: 1,
    zIndex: 1,
    borderWidth:1,
    padding:9,
    borderRadius: sizes.radius,
    borderColor:'#ddd',
    backgroundColor:'#fff',
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
  searchButton: {
    backgroundColor: colors.primary,
    padding: 12,
    borderRadius: sizes.radius,
    alignItems: 'center',
    marginTop: 5,
  },
  searchButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});

export default SearchBar;
