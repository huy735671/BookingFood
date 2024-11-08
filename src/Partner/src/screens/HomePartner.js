import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ScrollView,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import HeaderPartner from '../component/HeaderPartner';

const HomePartner = () => {
  // Dữ liệu mẫu
  const orders = [
    {
      id: '1',
      customer: 'Nguyễn Văn A',
      code: 'ORD001',
      price: '150.000 ₫',
      status: 'Mới',
    },
    {
      id: '2',
      customer: 'Trần Thị B',
      code: 'ORD002',
      price: '220.000 ₫',
      status: 'Đang chuẩn bị',
    },
    {
      id: '3',
      customer: 'Lê Văn C',
      code: 'ORD003',
      price: '180.000 ₫',
      status: 'Đang giao',
    },
  ];

  const bestSellingFoods = [
    {id: '1', name: 'Phở bò', sold: 25},
    {id: '2', name: 'Bánh mì thịt', sold: 20},
    {id: '3', name: 'Cơm gà', sold: 18},
  ];

  return (
    <SafeAreaView style={{flex: 1}}>
      <StatusBar
        barStyle="dark-content"
        translucent
        backgroundColor='#fff'
      />
      <HeaderPartner />
      <ScrollView style={styles.container}>
        {/* Doanh thu hôm nay */}
        <View style={styles.headerContainer}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Doanh thu hôm nay</Text>
          <Text style={styles.revenue}>2.500.000 ₫</Text>
          <Text style={styles.percentage}>+15% so với hôm qua</Text>
        </View>

        {/* Đơn hàng mới */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đơn hàng mới</Text>
          <Text style={styles.orderCount}>25</Text>
          <Text style={styles.percentage}>+5 trong giờ qua</Text>
        </View>
        </View>
        {/* Đơn hàng gần đây */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Đơn hàng gần đây</Text>
          {orders.map(order => (
            <View key={order.id} style={styles.orderItem}>
              <Text style={styles.customerInitial}>
                {order.customer.charAt(0)}
              </Text>
              <View style={styles.orderDetails}>
                <Text style={styles.customerName}>{order.customer}</Text>
                <Text style={styles.orderCode}>
                  {order.code} - {order.price}
                </Text>
                <Text style={styles.orderStatus(order.status)}>
                  {order.status}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Món ăn bán chạy */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Món ăn bán chạy</Text>
          {bestSellingFoods.map(food => (
            <View key={food.id} style={styles.foodItem}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.soldAmount}>{food.sold} đã bán</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomePartner;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 10,
  },
  headerContainer:{
    flexDirection:'row',

  },
  section: {
    flex: 1, 
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 5, 
    borderWidth: 1,
    borderColor:'#ddd',
    marginBottom:10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  revenue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#4caf50',
  },
  percentage: {
    fontSize: 14,
    color: '#4caf50',
  },
  orderCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff9800',
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  customerInitial: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196f3',
    marginRight: 12,
  },
  orderDetails: {
    flex: 1,
  },
  customerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderCode: {
    fontSize: 14,
    color: '#666',
  },
  orderStatus: status => ({
    fontSize: 14,
    color:
      status === 'Mới'
        ? '#4caf50'
        : status === 'Đang chuẩn bị'
        ? '#ff9800'
        : '#2196f3',
    fontWeight: 'bold',
  }),
  foodItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  foodName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  soldAmount: {
    fontSize: 16,
    color: '#666',
  },
});
