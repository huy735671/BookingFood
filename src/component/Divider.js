import {StyleSheet, Text, View} from 'react-native';
import React, { forwardRef } from 'react';
import { colors, spacing } from '../constants/theme';

const Divider = forwardRef(({style, enbledSpacing = true}, ref) => {
  return (
    <View
    ref={ref}
      style={[
        {
          height: 1,
          backgroundColor: colors.lightGray,
          marginHorizontal: enbledSpacing ? spacing.l : 0,
        },
      ]}
    />
  );
});

export default Divider;

const styles = StyleSheet.create({});
