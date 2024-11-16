import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import {colors, sizes} from '../constants/theme';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const CartScreen = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCartItems = async () => {
    try {
      const user = auth().currentUser;
      if (user) {
        const userEmail = user.email;
  
        const cartSnapshot = await firestore()
          .collection('cart')
          .where('email', '==', userEmail)
          .get();
  
        const cartItems = cartSnapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id, 
        }));
  
        const updatedItems = cartItems.map(item => ({
          ...item,
          quantity: 1,
        }));
  
        // Sử dụng reduce để nhóm các món ăn trùng vào một
        const groupedItems = updatedItems.reduce((acc, item) => {
          const key = `${item.dishId}-${item.email}`; // Tạo key duy nhất từ dishId và email
          if (!acc[key]) {
            acc[key] = { ...item, quantity: 1 }; // Tạo món ăn mới với số lượng là 1
          } else {
            acc[key].quantity += 1; // Nếu món ăn đã tồn tại, cộng dồn số lượng
          }
          return acc;
        }, {});
  
        const finalItems = await Promise.all(
          Object.values(groupedItems).map(async item => {
            const dishSnapshot = await firestore()
              .collection('dishes')
              .doc(item.dishId)
              .get();
  
            if (dishSnapshot.exists) {
              const dishData = dishSnapshot.data();
  
              const userSnapshot = await firestore()
                .collection('users')
                .where('email', '==', dishData.ownerEmail)
                .get();
  
              let storeName = 'Đang cập nhật'; 
              if (!userSnapshot.empty) {
                storeName = userSnapshot.docs[0].data().storeName || 'Đang cập nhật';
              }
  
              return {
                ...item,
                dishDetails: dishData,
                storeName, // Add the storeName field
              };
            }
            return item;
          }),
        );
  
        setItems(finalItems); // Cập nhật các món ăn với thông tin dishDetails và storeName
      }
    } catch (error) {
      console.error('Error fetching cart items:', error);
    } finally {
      setLoading(false);
    }
  };
  

  // Call fetchCartItems again when the screen loads or when "Cập nhật" button is pressed
  useEffect(() => {
    const user = auth().currentUser;
    if (user) {
      const userEmail = user.email;
  
      const unsubscribe = firestore()
        .collection('cart')
        .where('email', '==', userEmail)
        .onSnapshot(async snapshot => {
          const cartItems = snapshot.docs.map(doc => ({
            ...doc.data(),
            id: doc.id,
          }));
  
          const updatedItems = cartItems.map(item => ({
            ...item,
            quantity: 1,
          }));
  
          const groupedItems = updatedItems.reduce((acc, item) => {
            const key = `${item.dishId}-${item.email}`;
            if (!acc[key]) {
              acc[key] = { ...item, quantity: 1 };
            } else {
              acc[key].quantity += 1;
            }
            return acc;
          }, {});
  
          const finalItems = await Promise.all(
            Object.values(groupedItems).map(async item => {
              const dishSnapshot = await firestore()
                .collection('dishes')
                .doc(item.dishId)
                .get();
  
              if (dishSnapshot.exists) {
                const dishData = dishSnapshot.data();
  
                const userSnapshot = await firestore()
                  .collection('users')
                  .where('email', '==', dishData.ownerEmail)
                  .get();
  
                let storeName = 'Đang cập nhật';
                if (!userSnapshot.empty) {
                  storeName = userSnapshot.docs[0].data().storeName || 'Đang cập nhật';
                }
  
                return {
                  ...item,
                  dishDetails: dishData,
                  storeName,
                };
              }
              return item;
            })
          );
  
          setItems(finalItems);
          setLoading(false);
        });
  
      return () => unsubscribe(); 
    }
  }, []);
  

  const handleRefresh = () => {
    setLoading(true);
    fetchCartItems(); 
  };

  const toggleSelectItem = id => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id ? {...item, selected: !item.selected} : item,
      ),
    );
  };

  const updateQuantity = (id, increment) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id
          ? {...item, quantity: Math.max(item.quantity + increment, 1)} 
          : item,
      ),
    );
  };

  const removeItem = async id => {
    try {
      const itemToDelete = items.find(item => item.id === id);
      
      if (itemToDelete) {
        const dishIdToRemove = itemToDelete.dishId;
        const emailToRemove = itemToDelete.email;
    
        const cartSnapshot = await firestore()
          .collection('cart')
          .where('dishId', '==', dishIdToRemove)
          .where('email', '==', emailToRemove)
          .get();
    
        const batch = firestore().batch();
        cartSnapshot.docs.forEach(doc => {
          batch.delete(doc.ref);
        });
    
        await batch.commit();  
    
        setItems(prevItems => prevItems.filter(item => !(item.dishId === dishIdToRemove && item.email === emailToRemove)));
      }
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };
  
  

  const totalPrice = items.reduce((total, item) => {
    // Kiểm tra giá trị price và quantity có hợp lệ hay không
    if (item.selected && item.dishDetails?.price && item.quantity > 0) {
      return total + item.dishDetails.price * item.quantity;
    }
    return total;
  }, 0);

  const handleOrder = () => {
    const selectedItems = items.filter(item => item.selected);
    if (selectedItems.length > 0) {
      navigation.navigate('OrderDetails', {
        items: selectedItems, 
      });
    } else {
      alert('Bạn chưa chọn món nào để đặt hàng!');
    }
  };

  const groupedItems = items.reduce((acc, item) => {
    if (!acc[item.storeName]) {
      acc[item.storeName] = [];
    }
    acc[item.storeName].push(item);
    return acc;
  }, {});

  const formatCurrency = amount => {
    if (isNaN(amount) || amount === null || amount === undefined) {
      return '0 đ';
    }
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{textAlign: 'center', marginTop: 20}}>Đang tải lại...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Giỏ hàng của bạn</Text>
        <TouchableOpacity onPress={handleRefresh} style={styles.refreshButton}>
          <Text style={styles.refreshButtonText}>Cập nhật</Text>
        </TouchableOpacity>
      </View>

      {Object.keys(groupedItems).map(storeName => (
        <View key={storeName} style={styles.storeContainer}>
          <Text style={styles.storeTitle}>{storeName}</Text>
          {groupedItems[storeName].map((item, index) => (
            <View
              key={`${storeName}-${item.id || index}`}
              style={styles.itemContainer}>
              <CheckBox
                value={item.selected}
                onValueChange={() => toggleSelectItem(item.id)}
              />
              <View style={styles.itemDetails}>
                <Text style={styles.itemName}>
                  {item.dishDetails?.name || item.dishName}
                </Text>
                <Text style={styles.itemPrice}>
                  {formatCurrency(Number(item.dishDetails?.price) || 0)}
                </Text>
              </View>
              <View style={styles.quantityContainer}>
                <TouchableOpacity onPress={() => updateQuantity(item.id, -1)}>
                  <Text style={styles.quantityButton}>-</Text>
                </TouchableOpacity>
                <Text style={styles.quantity}>{item.quantity}</Text>
                <TouchableOpacity onPress={() => updateQuantity(item.id, 1)}>
                  <Text style={styles.quantityButton}>+</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Text style={styles.removeButton}>Xóa</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      ))}

      <View
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          left: 0,
          padding: 20,
          borderTopWidth:1,
          backgroundColor:'#fff',
          borderColor:'#ddd',
        }}>
        <View style={styles.footer}>
          <Text style={styles.totalText}>Tổng cộng:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(totalPrice)}</Text>
        </View>

        <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
          <Text style={styles.orderButtonText}>Tiến hành đặt hàng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth:1,
    borderColor:'#ddd',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  refreshButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 5,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  storeContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  storeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  itemDetails: {
    flex: 1,
    marginLeft: 10,
  },
  itemName: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: sizes.h3,
  },
  itemPrice: {
    marginTop: 5,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    fontSize: 18,
    paddingHorizontal: 10,
  },
  quantity: {
    fontSize: 18,
    width: 30,
    textAlign: 'center',
  },
  removeButton: {
    color: 'red',
    marginLeft: 10,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  totalText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  orderButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CartScreen;
