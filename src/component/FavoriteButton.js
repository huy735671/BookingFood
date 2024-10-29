import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Icon from './Icon';
import { colors, shadow } from '../constants/theme';

const FavoriteButton = ({active, style, onPress}) => {
  return (
    <TouchableOpacity onPress={onPress}>

    <View
      style={[
        {
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          padding: 4,
          borderRadius: 30,
        },
        shadow.light,
        style,
      ]}>
      <Icon icon={active ? 'FavoriteFilled' : 'Favorite'} size={24} />
    </View>
    </TouchableOpacity>

  );
};

export default FavoriteButton;
