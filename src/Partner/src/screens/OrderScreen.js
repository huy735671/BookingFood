import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import HeaderPartner from '../component/HeaderPartner';
import { colors } from '../../../constants/theme';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; // Import Firestore

const OrderList = ({ orders }) => {
  const getBackgroundColor = (orderStatus) => {
    switch (orderStatus) {
      case 'pending':
        return '#4caf50'; // Màu xanh lá (Mới)
      case 'confirmed':
        return '#ff9800'; // Màu cam (Đang chuẩn bị)
      case 'ready':
        return '#ADFF2F'; // Màu xanh dương (Đang giao)
      case 'complete':
        return '#97FFFF'; // Màu xanh lá nhạt (Hoàn thành)
      case 'canceled':
        return '#f44336'; // Màu đỏ (Đã hủy)
      default:
        return '#fff'; // Mặc định là trắng
    }
  };

  const getStatusText = (orderStatus) => {
    switch (orderStatus) {
      case 'pending':
        return 'Mới';
      case 'confirmed':
        return 'Đang chuẩn bị';
      case 'ready':
        return 'Đang giao';
      case 'complete':
        return 'Hoàn thành';
      case 'canceled':
        return 'Đã hủy';
      default:
        return 'Không xác định';
    }
  };

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View style={styles.orderCard}>
          <View style={styles.statusContainer}>
            <Text style={styles.orderId}>{item.id}</Text>
            <Text
              style={[
                styles.orderStatus,
                { backgroundColor: getBackgroundColor(item.status) },
              ]}
            >
              {getStatusText(item.status)}
            </Text>
          </View>
          <Text style={styles.customerName}>khách hàng: {item.customerEmail}</Text>
          <Text style={styles.orderItems}>
            {item.items.map((dish) => dish.dishName).join(', ')}
          </Text>
          <Text style={styles.totalAmount}>Tổng cộng: {item.totalAmount} ₫</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.detailButton}>
              <Text style={styles.buttonText}>Chi tiết</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.updateStatusButton}>
              <Text style={styles.buttonUpdateText}>Cập nhật trạng thái</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    />
  );
};

const OrderScreen = () => {
  const [userEmail, setUserEmail] = useState(null);
  const [filteredOrders, setFilteredOrders] = useState([]);

  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      setUserEmail(user.email);  
      console.log("Current logged-in user email:", user.email); 

      // Fetch orders from Firestore
      firestore()
        .collection('orders')
        .get()
        .then((querySnapshot) => {
          const orders = querySnapshot.docs.map((doc) => {
            const orderData = doc.data();
            const filteredItems = orderData.items.filter(item => item.ownerEmail === user.email);
            return { ...orderData, id: doc.id, items: filteredItems };
          });

          const filteredOrders = orders.filter(order => order.items.length > 0);

          setFilteredOrders(filteredOrders);
        })
        .catch((error) => {
          console.error("Error fetching orders:", error);
        });
    } else {
      console.log("No user is logged in.");
    }
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <HeaderPartner />
      {userEmail ? <Text>Welcome, {userEmail}</Text> : <Text>Loading user information...</Text>}
      <OrderList orders={filteredOrders} />
    </SafeAreaView>
  );
};

export default OrderScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  orderId: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  statusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderStatus: {
    fontSize: 16,
    color: colors.primary,
    marginVertical: 5,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 2,
    backgroundColor: '#007cff',
    borderRadius: 20,
  },
  customerName: {
    fontSize: 16,
    fontWeight: '500',
  },
  orderItems: {
    fontSize: 15,
    color: '#666',
    marginVertical: 5,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 10,
  },
  detailButton: {
    borderWidth: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginRight: 5,
  },
  updateStatusButton: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: 'bold',
  },
  buttonUpdateText: {
    color: '#ddd',
    fontSize: 15,
    fontWeight: 'bold',
  },
});
