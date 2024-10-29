import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {colors} from '../../constants/theme';

const SpecialOffer = ({navigation}) => {
  const handlePress = () => {
 
    navigation.navigate('SpecialOfferDetails'); 
  };

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      <TouchableOpacity style={styles.offerContainer}>
        <Text style={styles.offerTitle}>Flash Sale mỗi ngày</Text>
        <Text style={styles.offerSubtitle}>
          Flash Sale mỗi ngày
        </Text>
    
      </TouchableOpacity>
      <TouchableOpacity style={styles.offerContainer2}>
        <View style={styles.offerContent}>
          <Text style={styles.offerTitle}>Ngàn quán giảm 50%</Text>
          <Text style={styles.offerSubtitle}>
            Ăn ngon đủ món
          </Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  offerContainer: {
    backgroundColor: '#518ef8',
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  offerContainer2:{
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor:'#c9998d',
    marginLeft:10,
  },
  offerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.light,
    marginBottom: 10,
  },
  offerSubtitle: {
    fontSize: 14,
    color: colors.light,
    marginBottom: 20,
  },
  button: {
    backgroundColor: colors.light,
    paddingVertical: 6,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignSelf: 'flex-start',
  },
  buttonText: {
    color: colors.primary,
    fontWeight: 'bold',
  },
});

export default SpecialOffer;
