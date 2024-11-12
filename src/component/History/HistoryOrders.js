import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Icon from '../Icon';
import { colors, sizes } from '../../constants/theme';

const HistoryOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const user = auth().currentUser;
      if (user) {
        try {
          const ordersSnapshot = await firestore()
            .collection('orders')
            .where('customerEmail', '==', user.email)
            .get();

          const ordersData = ordersSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
            orderTime: doc.data().orderTime?.toDate(), // Convert Firestore timestamp to JS Date
          }));

          setOrders(ordersData);
        } catch (error) {
          console.error('Lỗi khi lấy dữ liệu đơn hàng:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <Text>Không có đơn hàng nào.</Text>
      </View>
    );
  }

  const getBackgroundColor = orderStatus => {
    switch (orderStatus) {
      case 'pending':
        return '#4caf50';
      case 'confirmed':
        return '#ff9800';
      case 'ready':
        return '#ADFF2F';
      case 'complete':
        return '#3c80f1';
      case 'canceled':
        return '#f44336';
      default:
        return '#fff';
    }
  };

  const getStatusText = orderStatus => {
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
  const formatPrice = price => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const renderOrderItem = ({item}) => (
    <View style={styles.orderCard}>
      <Text style={styles.orderTitle}>Đơn hàng: #{item.id}</Text>
      {item.orderTime && (
        <Text style={styles.orderTime}>
          {new Intl.DateTimeFormat('vi-VN').format(item.orderTime)}
        </Text>
      )}
      <FlatList
        data={item.items}
        keyExtractor={(dish, index) => index.toString()}
        renderItem={({item: dish}) => (
          <View style={styles.dishItem}>
            <Text style={styles.dishText}>
              {dish.dishName} (x{dish.quantity})
            </Text>
            <View
              style={[
                styles.statusContainer,
                {backgroundColor: getBackgroundColor(dish.status)},
              ]}>
              <Text style={styles.statusText}>{getStatusText(dish.status)}</Text>
            </View>
          </View>
        )}
      />
      <View style={styles.footerDetalContainer}>
      <Text style={styles.priceText}>{formatPrice(item.totalWithShipping)}đ</Text>
      <TouchableOpacity onPress={()=>{}} style={styles.detailButton}>
        <Text style={styles.sectionText}>Chi tiết</Text>
        <Icon icon="ArrowRight" size={15} style={styles.icon}/>
      </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={item => item.id}
        renderItem={renderOrderItem}
      />
    </View>
  );
};

export default HistoryOrders;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefefe',
    padding: 10,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderWidth:1,
    borderColor:'#ddd',
    elevation: 5,
  },
  dishItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dishText:{
    color:colors.black,
    fontSize:sizes.body,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  orderTime: {
    fontSize: 14,
    color: '#555',
  },
  statusContainer: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginTop: 5,
    alignItems: 'center',
  },
  statusText:{
    color:colors.light,
    fontSize:sizes.body,
    fontWeight:'bold',
    padding:2,
  },
  priceText:{
    color:colors.primary,
    fontSize:sizes.h3,
    fontWeight:'bold',
  },
  footerDetalContainer:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
  },
  detailButton:{
    borderWidth:1,
    marginTop:10,
    padding:5,
    flexDirection:'row',
    alignItems:'center',
    borderRadius:5,
    borderColor:'#ddd',
  },
  icon:{
    marginLeft:5,
  },
  sectionText:{
    color:colors.primary,
    fontSize:sizes.body,

  },
});
