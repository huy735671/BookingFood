import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import React from 'react';

const SIGN_IN = 'SIGN_IN';
const SIGN_UP = 'SIGN_UP';

const LoginHeader = ({page, setPage}) => {
  return (
    <View style={{flex: 1}}>
      <View style={{width: '100%', height: '100%'}}>
        <View style={styles.container}>
          <Text style={styles.titleHeader}>Chào bạn</Text>
          <Text style={{color: '#ffffff'}}>Gọi là nghe, alo là có.!</Text>
        </View>
        <View style={{height: 50, flexDirection: 'row', backgroundColor:'white'}}>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setPage(SIGN_IN)}
            disabled={page === SIGN_IN}>
            <Text style={{fontSize: 20, color: '#4D8D6E'}}>Đăng nhập</Text>
            {page === SIGN_IN && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.tabButton}
            onPress={() => setPage(SIGN_UP)}
            disabled={page === SIGN_UP}>
            <Text style={{fontSize: 20, color: '#4D8D6E'}}>Đăng ký</Text>
            {page === SIGN_UP && <View style={styles.tabUnderline} />}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default LoginHeader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '25%',
    backgroundColor: '#4D8D6E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  titleHeader: {
    fontSize: 50,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  tabButton: {
    width: '50%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabUnderline: {
    height: 3,
    width: '100%',
    backgroundColor: '#4D8D6E',
    position: 'absolute',
    bottom: 0,
  },
});
