import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import { colors, sizes, spacing } from '../constants/theme';

const ScreenHeader = ({mainTitle, secondTitle}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>{mainTitle}</Text>
      <Text style={styles.secondTitle}>{secondTitle}</Text>
    </View>
  );
};

export default ScreenHeader;

const styles = StyleSheet.create({
    container:{
        paddingHorizontal: spacing.l,
        paddingVertical: spacing.l ,
    },
    mainTitle:{
        fontSize: sizes.title,
        fontWeight:'bold',
        color: colors.black,
    },
    secondTitle:{
        fontSize: sizes.title,
        color: colors.lightGray,

    },
    
});
