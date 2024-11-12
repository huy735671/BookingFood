import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList, Button} from 'react-native';
import {colors, sizes, spacing} from '../../../../constants/theme';
import {useRoute} from '@react-navigation/native';
import {format} from 'date-fns';

const OrderDetailsScreen = () => {
  const route = useRoute();
  const {order} = route.params;

  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    if (order) {
      const totalDishPrice = order.items.reduce((sum, dish) => {
        const dishTotal = (parseFloat(dish.price) || 0) * (dish.quantity || 1);
        return sum + dishTotal;
      }, 0);
      const total = totalDishPrice + (order.shippingFee || 0);
      setTotalAmount(total);
    }
  }, [order]);

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
        return 'Không xác định'; // Nếu không phải các trạng thái đã định nghĩa
    }
  };
  const formatCurrency = value => {
    const numericValue = parseFloat(value); // Chuyển giá trị sang số
    return numericValue.toLocaleString('vi-VN'); // Định dạng theo kiểu Việt Nam
  };
  // Chuyển đổi orderTime từ Timestamp sang định dạng ngày tháng
  const formatOrderTime = timestamp => {
    const date = new Date(timestamp.seconds * 1000); // Chuyển đổi Timestamp sang Date
    return format(date, "dd/MM/yyyy, HH'h'mm''");
  };

  return (
    <FlatList
      data={order.items} // Danh sách món ăn
      keyExtractor={(item, index) => index.toString()}
      ListHeaderComponent={
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.orderId}>Đơn hàng #{order.id}</Text>
          </View>

          {/* Thông tin khách hàng */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Thông tin khách hàng</Text>
            <Text>Email: {order.customerEmail}</Text>
            <Text>Số điện thoại: {order.customerAddress}</Text>
            <Text>Thời gian đặt: {formatOrderTime(order.orderTime)}</Text>
          </View>

          {/* Tổng cộng */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tổng cộng</Text>
            <Text style={styles.totalAmountText}>
              {formatCurrency(totalAmount)}₫ (Phí vận chuyển:{' '}
              {formatCurrency(order.shippingFee)}₫)
            </Text>
          </View>

          {/* Thông tin trạng thái */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Trạng thái</Text>
            <Text style={styles.totalAmountText}>
              {order?.items[0]?.status
                ? getStatusText(order.items[0].status)
                : 'Trạng thái chưa có'}
            </Text>
          </View>

          {/* Nút quay lại */}
          <View style={styles.actionButtons}>
            <Text> Danh sách món ăn</Text>
          </View>
        </View>
      }
      renderItem={({item}) => (
        <View style={styles.itemCard}>
          <Text style={styles.itemName}>{item.dishName}</Text>
          <Text>Số lượng: {item.quantity}</Text>
          <Text>Đơn giá: {formatCurrency(item.price)}₫</Text>
          <Text>Tổng cộng: {formatCurrency(item.price * item.quantity)}₫</Text>
          {item.selectedOptions ? (
            <Text>Tùy chọn món ăn : {item.selectedOptions}</Text>
          ) : null}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    padding: spacing.s + spacing.s,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.m,
    paddingBottom: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  orderId: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  status: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    color: colors.white,
  },
  section: {
    marginBottom: spacing.l,
    padding: spacing.m,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: spacing.s,
  },
  itemCard: {
    marginBottom: spacing.m,
    padding: spacing.m,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#f9f9f9',
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  totalAmountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  actionButtons: {
    marginTop: spacing.l,
  },
});

export default OrderDetailsScreen;
