import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';
import HeaderPartner from '../component/HeaderPartner';
import { colors } from '../../../constants/theme';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import OrderList from '../component/Orders/OrderList';

const OrderScreen = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setUserEmail(user.email);

      // Lắng nghe sự thay đổi của đơn hàng trong Firestore
      const unsubscribe = firestore()
        .collection('orders')
        .onSnapshot(querySnapshot => {
          const orders = querySnapshot.docs.map(doc => {
            const orderData = doc.data();

            // Lọc các món ăn có ownerEmail trùng với email của người dùng
            const filteredItems = orderData.items.filter(item => item.ownerEmail === user.email);

            // Nếu có ít nhất một món ăn trùng với email người dùng, ta lấy các món đó
            return { ...orderData, id: doc.id, items: filteredItems };
          });

          // Lọc các đơn hàng chỉ còn các món ăn thỏa mãn điều kiện
          const filteredOrders = orders.filter(order => order.items.length > 0);
          setFilteredOrders(filteredOrders);
        });

      // Cleanup khi component bị hủy
      return () => unsubscribe();

    } else {
      console.log('No user is logged in.');
    }
  }, []); 

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPartner />
 
      <OrderList orders={filteredOrders} />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default OrderScreen;
