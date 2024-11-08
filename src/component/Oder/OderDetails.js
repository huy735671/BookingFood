import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {colors, sizes} from '../../constants/theme';
import Divider from '../Divider';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const OrderDetails = () => {
  const route = useRoute();
  const {items} = route.params;
  const navigation = useNavigation();
  const [userAddress, setUserAddress] = useState('');
  const totalAmount = items.reduce((total, item) => {
    if (item.selected && item.dishDetails?.price && item.quantity > 0) {
      return total + item.dishDetails.price * item.quantity;
    }
    return total;
  }, 0);

  const formatCurrency = amount => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '0 đ';
    }
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  };

  const shippingFee = 15000;
  const totalWithShipping = totalAmount + shippingFee;

  const groupedItems = items.reduce((acc, item) => {
    if (!item.storeName) {
      console.log(
        `Item: ${item.dishName} is missing storeName, assigning default value.`,
      );
      item.storeName = 'Cửa hàng không rõ';
    }

    if (!acc[item.storeName]) acc[item.storeName] = [];
    acc[item.storeName].push(item);
    return acc;
  }, {});

  const [paymentMethod, setPaymentMethod] = useState('cash');

  const handlePaymentMethodChange = method => {
    setPaymentMethod(method);
  };

  const handlePlaceOrder = async () => {
    try {
      const currentUser = auth().currentUser;
      const userEmail = currentUser?.email; 
  
      const orderData = {
        items: items.map(item => ({
          dishName: item.dishName,
          quantity: item.quantity,
          price: item.dishDetails?.price,
          storeName: item.storeName,
          ownerEmail: item.dishDetails?.ownerEmail,
          selectedOptions: item.selectedOptions,
          status:'pending' ,
        })),
        totalAmount,
        shippingFee,
        totalWithShipping,
        userAddress,
        paymentMethod,
        orderTime: firestore.FieldValue.serverTimestamp(),
        customerEmail: userEmail,
        customerAddress: userAddress,
      };
  
      await firestore().collection('orders').add(orderData);
  
      await Promise.all(
        items.map(item => firestore().collection('cart').doc(item.id).delete())
      );
  
      navigation.navigate('PaymentSuccess', {
        items: items.map(item => ({
          ...item,
          price: item.dishDetails?.price,
        })),
        totalWithShipping,
        shippingFee,
        totalAmount,
        userAddress,
        paymentMethod,
      });
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };
  

  useEffect(() => {
    const fetchUserAddress = async () => {
      try {
        const currentUser = auth().currentUser;
        if (currentUser) {
          const userDoc = await firestore()
            .collection('users')
            .doc(currentUser.email)
            .get();

          if (userDoc.exists) {
            setUserAddress(
              userDoc.data()?.selectedAddress || 'Chưa có địa chỉ',
            );
          }
        }
      } catch (error) {
        console.error('Error fetching user address:', error);
      }
    };

    fetchUserAddress();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Tóm tắt đơn hàng</Text>

        <View style={styles.orderSummary}>
          {Object.keys(groupedItems).map((storeName, index) => (
            <View
              key={`store-${storeName}-${index}`}
              style={[
                styles.storeContainer,
                index !== Object.keys(groupedItems).length - 1 &&
                  styles.separator,
              ]}>
              <Text style={styles.storeTitle}>
                {storeName ? storeName : 'Tên cửa hàng không có'}
              </Text>
              {groupedItems[storeName].map((item, itemIndex) => (
                <View
                  key={`item-${item.id || itemIndex}-${storeName}`}
                  style={styles.itemRow}>
                  <Text style={styles.itemName}>
                    {item.quantity}x {item.dishName}
                  </Text>
                  <Text style={styles.itemPrice}>
                    {item.dishDetails?.price
                      ? formatCurrency(item.dishDetails.price * item.quantity)
                      : 'Giá không có'}
                  </Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.infoUser}>
          <Text style={styles.title}>Địa chỉ giao hàng</Text>
          <Text style={styles.titleinfoUser}>Địa chỉ</Text>
          <TextInput
            style={styles.input}
            placeholder="Địa chỉ"
            value={userAddress}
            editable={false}
          />
          <Text style={styles.titleinfoUser}>Ghi chú</Text>
          <TextInput
            style={styles.input}
            placeholder="Ghi chú cho tài xế (Nếu có)"
          />
        </View>

        <View style={styles.paymentContainer}>
          <Text style={styles.title}>Phương thức thanh toán</Text>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => handlePaymentMethodChange('cash')}>
            <View style={styles.outerCheckbox}>
              {paymentMethod === 'cash' && (
                <View style={styles.innerCheckbox} />
              )}
            </View>
            <Text>Tiền mặt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => handlePaymentMethodChange('card')}>
            <View style={styles.outerCheckbox}>
              {paymentMethod === 'card' && (
                <View style={styles.innerCheckbox} />
              )}
            </View>
            <Text>Thẻ tín dụng/ghi nợ</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => handlePaymentMethodChange('momo')}>
            <View style={styles.outerCheckbox}>
              {paymentMethod === 'momo' && (
                <View style={styles.innerCheckbox} />
              )}
            </View>
            <Text>Ví MoMo</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.summaryContainer}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Tạm tính:</Text>
            <Text style={styles.summaryText}>
              {formatCurrency(totalAmount)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Phí giao hàng:</Text>
            <Text style={styles.summaryText}>
              {formatCurrency(shippingFee)}
            </Text>
          </View>
          <Divider />
          <View style={styles.summaryRow}>
            <Text style={styles.totalText}>Tổng cộng:</Text>
            <Text style={styles.totalText}>
              {formatCurrency(totalWithShipping)}
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.totalButton} onPress={handlePlaceOrder}>
          <Text style={styles.totalText}>Đặt hàng: </Text>
          <Text style={styles.totalAmount}>
            {formatCurrency(totalWithShipping)}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: colors.primary,
  },
  orderSummary: {
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    overflow: 'hidden',
    backgroundColor: '#f8f8f8',
    marginBottom: 15,
  },
  storeContainer: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  separator: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  storeTitle: {
    fontSize: sizes.h3 + 2,
    fontWeight: 'bold',
    color: colors.primary,
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  itemName: {
    fontSize: sizes.h3,
    color: colors.primary,
  },
  itemPrice: {
    fontSize: 16,
    color: colors.primary,
  },
  infoUser: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 15,
    borderColor: '#ddd',
    marginBottom: 15,
  },
  titleinfoUser: {
    fontSize: sizes.h3,
    color: colors.primary,
    marginVertical: 5,
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginTop: 5,
  },
  paymentContainer: {
    padding: 10,
    borderRadius: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  outerCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    backgroundColor: '#fff',
  },
  innerCheckbox: {
    width: 10,
    height: 10,
    borderRadius: 7.5,
    backgroundColor: colors.primary,
  },
  summaryContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    backgroundColor: '#f8f8f8',
    marginBottom: 15,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 5,
  },
  summaryText: {
    fontSize: 16,
    color: colors.primary,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.primary,
  },
  totalButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    padding: 15,
    backgroundColor: '#4CAF50',
    borderRadius: 15,
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default OrderDetails;
