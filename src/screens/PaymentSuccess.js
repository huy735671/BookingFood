import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {colors, sizes} from '../constants/theme';
import Divider from '../component/Divider';

const PaymentSuccess = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {items, totalWithShipping, shippingFee, totalAmount} = route.params;

  const formatCurrency = amount => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' ₫';
  };

  // Tạo mã đơn hàng ngẫu nhiên
  const generateOrderNumber = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image
            source={require('../../assets/images/sucess.png')}
            style={styles.image}
          />
        </View>
        <Text style={styles.title}>Đặt hàng thành công!</Text>
        <Text style={styles.subtitle}>
          Cảm ơn bạn đã đặt hàng. Đơn hàng của bạn đang được xử lý.
        </Text>

        <View style={styles.orderSummary}>
          <Text style={styles.summaryText}>Chi tiết đơn hàng</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.totalText}>Mã đơn hàng:</Text>
            <Text style={styles.itemPrice}>{generateOrderNumber()}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.totalText}>Thời gian giao dự kiến:</Text>
            <Text style={styles.itemPrice}>30-45 phút</Text>
          </View>
          <Divider />

          {items.map(item => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={styles.itemName}>
                {item.quantity}x {item.name}
              </Text>
              <Text style={styles.itemPrice}>
                {formatCurrency(item.price * item.quantity)}
              </Text>
            </View>
          ))}

          <Divider />
          <View style={{marginTop:10,}}/>
          <View style={styles.summaryRow}>
            <Text style={styles.itemName}>Tạm tính:</Text>
            <Text style={styles.itemPrice}>{formatCurrency(totalAmount)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.itemName}>Phí giao hàng:</Text>
            <Text style={styles.itemPrice}>{formatCurrency(shippingFee)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.totalText}>Tổng cộng:</Text>
            <Text style={styles.totalText}>
              {formatCurrency(totalWithShipping)}
            </Text>
          </View>


        </View>



        <View style={styles.summarycoluomn}>
          <Text style={styles.summaryText}>Địa chỉ giao hàng:</Text>
          <Text style={styles.totallocationText}>
            123 Đường Lê Lợi, Quận 1, TP.HCM
          </Text>
        </View>
        <TouchableOpacity
          style={styles.trackButton}
          onPress={() => alert('Theo dõi đơn hàng')}>
          <Text style={styles.trackButtonText}>Theo dõi đơn hàng</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.navigate('Home')}>
          <Text style={styles.backButtonText}>Quay lại trang chủ</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#fff',
  },
  imageContainer: {
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 15,
    textAlign: 'center',
    color: colors.secondary,
  },
  orderSummary: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    backgroundColor: '#f8f8f8',
    marginBottom: 15,
  },
  summaryText: {
    fontSize: sizes.h2,
    marginBottom: 15,
    color:colors.primary,
    fontWeight:'bold',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  summarycoluomn: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  totallocationText: {
    fontSize: sizes.h3,
    color: colors.gray,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 5,
    
  },
  itemName: {
    fontSize: sizes.h3,
    color: colors.primary,
  },
  itemPrice: {
    fontSize: sizes.h3,
    color: colors.primary,
  },
  totalText: {
    fontSize: 20,
    color: colors.primary,
  },
  trackButton: {
    padding: 15,
    borderWidth: 1,
    borderRadius: 10,
    alignItems: 'center',
    borderColor: '#ddd',
  },
  trackButtonText: {
    color: colors.primary,
    fontSize: 18,
  },
  backButton: {
    marginTop: 10,
    padding: 15,
    backgroundColor: colors.primary,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default PaymentSuccess;
