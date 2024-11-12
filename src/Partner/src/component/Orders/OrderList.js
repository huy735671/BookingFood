import React, {useEffect, useState} from 'react';
import {
  FlatList,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Modal,
  Button,
  SafeAreaView,
} from 'react-native';
import {colors, shadow, sizes, spacing} from '../../../../constants/theme';
import Icon from '../../../../component/Icon';
import firestore from '@react-native-firebase/firestore';
import {useNavigation} from '@react-navigation/native';

const OrderList = ({orders}) => {
  const [ordersData, setOrdersData] = useState(orders);

  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const navigation = useNavigation();

  useEffect(() => {
    // Nếu đã có dữ liệu truyền vào từ props (orders), không cần lắng nghe Firestore
    if (orders && orders.length > 0) {
      setOrdersData(orders); // Cập nhật orders từ props vào state
    } else {
      const unsubscribe = firestore()
        .collection('orders')
        .onSnapshot(querySnapshot => {
          const ordersList = [];
          querySnapshot.forEach(documentSnapshot => {
            ordersList.push({
              ...documentSnapshot.data(),
              id: documentSnapshot.id,
            });
          });
          setOrdersData(ordersList); // Cập nhật lại dữ liệu orders khi có thay đổi
        });

      // Cleanup khi component bị hủy
      return () => unsubscribe();
    }
  }, [orders]); // Chỉ chạy lại khi orders thay đổi

  const handleDetailPress = order => {
    navigation.navigate('OrderDetailsScreen', {order}); // Pass order data to the details screen
  };

  const getBackgroundColor = orderStatus => {
    switch (orderStatus) {
      case 'pending':
        return '#4caf50';
      case 'confirmed':
        return '#ff9800';
      case 'ready':
        return '#ADFF2F';
      case 'complete':
        return '#97FFFF';
      case 'canceled':
        return '#f44336';
      default:
        return '#fff';
    }
  };

  const getOrderStatus = items => {
    if (items.every(item => item.status === 'pending')) return 'pending';
    if (items.some(item => item.status === 'confirmed')) return 'confirmed';
    if (items.some(item => item.status === 'ready')) return 'ready';
    if (items.every(item => item.status === 'complete')) return 'complete';
    if (items.some(item => item.status === 'canceled')) return 'canceled';
    return 'Đang cập nhật';
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
        return 'Không xác định'; // Nếu không phải các trạng thái đã định nghĩa
    }
  };

  const handleUpdateStatus = order => {
    setCurrentOrder(order);
    setNewStatus(getOrderStatus(order.items)); // Gán trạng thái hiện tại cho trạng thái mới
    setShowModal(true);
  };

  const handleSaveStatus = async () => {
    if (currentOrder && newStatus && currentOrder.items) {
      // Tìm item trong mảng items mà bạn muốn cập nhật (giả sử bạn muốn cập nhật tất cả các item)
      const updatedItems = currentOrder.items.map(item => {
        // Giả sử bạn muốn cập nhật trạng thái của tất cả các món ăn
        return {
          ...item,
          status: newStatus, // Cập nhật trạng thái mới cho item
        };
      });

      try {
        await firestore()
          .collection('orders') // Tên collection đơn hàng
          .doc(currentOrder.id) // ID đơn hàng
          .update({
            items: updatedItems, // Cập nhật lại mảng items với trạng thái mới
            updatedAt: firestore.FieldValue.serverTimestamp(), // Lưu thời gian cập nhật
          });

        console.log(
          `Đơn hàng ${currentOrder.id} đã cập nhật trạng thái: ${newStatus}`,
        );
        setShowModal(false); // Đóng modal sau khi lưu
      } catch (error) {
        console.error('Lỗi cập nhật trạng thái: ', error);
      }
    }
  };

  // Bộ lọc theo trạng thái
  const filteredOrders = ordersData.filter(order => {
    const orderStatus = getOrderStatus(order.items);
    const matchesStatus =
      filterStatus === 'all' || orderStatus === filterStatus;
    const matchesSearch =
      order.id.includes(searchQuery) ||
      order.customerEmail.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  return (
    <SafeAreaView  style={styles.container}>
      {/* Ô tìm kiếm */}
      <View style={styles.inner}>
        <View style={styles.search} pointerEvents="none">
          <Icon icon="Search" />
        </View>
        <TextInput
          style={styles.searchInput}
          placeholder="Mã đơn hàng hoặc email khách hàng..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />
        <View style={styles.filter}>
          <Icon icon="Filter" onPress={() => setShowFilters(!showFilters)} />
        </View>
      </View>

      {/* Bộ lọc, chỉ hiển thị khi showFilters là true */}
      {showFilters && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.categoriesContainer}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'all' && styles.activeFilterButton,
            ]}
            onPress={() => setFilterStatus('all')}>
            <Text style={styles.filterButtonText}>Tất cả</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'pending' && styles.activeFilterButton,
            ]}
            onPress={() => setFilterStatus('pending')}>
            <Text style={styles.filterButtonText}>Mới</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'confirmed' && styles.activeFilterButton,
            ]}
            onPress={() => setFilterStatus('confirmed')}>
            <Text style={styles.filterButtonText}>Đang chuẩn bị</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'ready' && styles.activeFilterButton,
            ]}
            onPress={() => setFilterStatus('ready')}>
            <Text style={styles.filterButtonText}>Đang giao</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'complete' && styles.activeFilterButton,
            ]}
            onPress={() => setFilterStatus('complete')}>
            <Text style={styles.filterButtonText}>Hoàn thành</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filterStatus === 'canceled' && styles.activeFilterButton,
            ]}
            onPress={() => setFilterStatus('canceled')}>
            <Text style={styles.filterButtonText}>Đã hủy</Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Modal cho việc cập nhật trạng thái */}
      <Modal visible={showModal} animationType="slide" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text style={styles.modalTitle}>Cập nhật trạng thái</Text>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <Icon icon="close" size={30} />
              </TouchableOpacity>
            </View>
            <Text style={styles.currentStatus}>
              Trạng thái hiện tại: {getStatusText(newStatus)}
            </Text>

            {/* FlatList cho các trạng thái */}
            <FlatList
              data={[
                {label: 'Mới', value: 'pending'},
                {label: 'Đang chuẩn bị', value: 'confirmed'},
                {label: 'Đang giao', value: 'ready'},
                {label: 'Hoàn thành', value: 'complete'},
                {label: 'Đã hủy', value: 'canceled'},
              ]}
              keyExtractor={item => item.value}
              renderItem={({item}) => (
                <TouchableOpacity
                  style={[
                    styles.statusOption,
                    newStatus === item.value && styles.selectedStatus,
                  ]}
                  onPress={() => setNewStatus(item.value)}>
                  <Text style={styles.statusOptionText}>{item.label}</Text>
                </TouchableOpacity>
              )}
            />

            <View style={styles.modalButtons}>
              <Button title="Lưu" onPress={handleSaveStatus} />
            </View>
          </View>
        </View>
      </Modal>
 
      {/* Danh sách đơn hàng */}
      <FlatList
      showsVerticalScrollIndicator={false}
        data={filteredOrders}
        keyExtractor={item => item.id}
        renderItem={({item}) => {
          const orderStatus = getOrderStatus(item.items);
          const totalDishPrice = item.items.reduce((sum, dish) => {
            
            const dishTotal = (parseFloat(dish.price) || 0) * (dish.quantity || 1);
            return sum + dishTotal; 
          }, 0);
          const totalAmount = totalDishPrice + (item.shippingFee || 0);
          return (
            <View style={styles.orderCard}>
              <View style={styles.statusContainer}>
                <Text style={styles.orderId}>{item.id}</Text>
                <Text
                  style={[
                    styles.orderStatus,
                    {backgroundColor: getBackgroundColor(orderStatus)},
                  ]}>
                  {getStatusText(orderStatus)}
                </Text>
              </View>
              <Text style={styles.customerName}>
                Khách hàng: {item.customerEmail}
              </Text>
              <Text style={styles.orderItems}>
                {item.items.map(dish => dish.dishName).join(', ')} 
              </Text>

              <View style={styles.orderItems}>
                {item.items.map((dish, index) => (
                  <Text key={index}>Đơn giá: {dish.price}₫ x {dish.quantity}</Text>
                ))}
              </View>

               
              

              <Text style={styles.totalAmount}>
                Tổng cộng: {totalAmount} ₫ (Ship:{item.shippingFee}đ)
              </Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity
                  style={styles.detailButton}
                  onPress={() => handleDetailPress(item)}>
                  <Text style={styles.buttonText}>Chi tiết</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.updateStatusButton}
                  onPress={() => handleUpdateStatus(item)}>
                  <Text style={styles.buttonUpdateText}>
                    Cập nhật trạng thái
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
        contentContainerStyle={{ flexGrow: 1 }}
        
      />
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex:1,
  },
  
  inner: {
    flexDirection: 'row',
  },
  search: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: colors.white,
    paddingLeft: spacing.xl + spacing.s,
    paddingRight: spacing.m,
    paddingVertical: spacing.m,
    borderRadius: sizes.radius,
    height: 54,
    flex: 1,
    elevation: 5,
    ...shadow.light,
    marginBottom: 10,
  },
  filter: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  filterContainer: {
    marginBottom: 10,
    
  },
  categoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    
  },
  filterButton: {
    backgroundColor: '#ddd',
    padding: 10,
    marginHorizontal: 5,
    borderRadius: 5,
    justifyContent:'center',
    alignItems:'center',
    height:45,
   
  },
  activeFilterButton: {
    backgroundColor: '#007BFF',
    
  },
  filterButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.primary,
  },
  orderCard: {
    backgroundColor: '#fff',
    padding: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
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

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: '80%',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  currentStatus: {
    marginVertical: 10,
    fontSize: 16,
  },
  statusOption: {
    padding:10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedStatus: {
    backgroundColor: '#ccc',
  },
  statusOptionText: {
    fontSize: 16,
    color: '#333',
  },
  modalButtons: {
    marginTop: 20,
  },
});

export default OrderList;
