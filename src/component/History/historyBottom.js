import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { colors, shadow } from '../../constants/theme';
import Icon from '../Icon';

const HistoryBottom = ({ onPress , style}) => {
  return (
   
      <TouchableOpacity  onPress={onPress}>
         <View style={[
        {
          backgroundColor: colors.lightGray,
          padding: 15,
          borderRadius: 30,
        },
        shadow.light,
        style,
      ]}>
        <Icon icon="history" size={30} color='white'/>
        </View>

      </TouchableOpacity>
  );
};

export default HistoryBottom;

