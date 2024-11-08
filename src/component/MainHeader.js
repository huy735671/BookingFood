import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput } from 'react-native';
import Icon from './Icon';
import { colors, spacing } from '../constants/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const MainHeader = ({ title, userLocation, addresses, onAddAddress }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(userLocation || 'Chưa chọn địa chỉ');
  const [newAddress, setNewAddress] = useState('');
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const fetchUserLocation = async () => {
      const user = auth().currentUser;
      if (user) {
        try {
          const userDoc = await firestore().collection('users').doc(user.email).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            setSelectedAddress(userData?.selectedAddress || 'Chưa chọn địa chỉ');
          }
        } catch (error) {
          console.error('Lỗi khi lấy địa chỉ của người dùng:', error);
        }
      }
    };
    
    fetchUserLocation();
  }, []);

  const handleSelectAddress = (address) => {
    setSelectedAddress(address);
    setModalVisible(false);
    saveSelectedAddress(address);  
  };

  const saveSelectedAddress = async (address) => {
    const user = auth().currentUser;
    if (user) {
      try {
        await firestore()
          .collection('users')
          .doc(user.email)
          .update({
            selectedAddress: address,  
          });
      } catch (error) {
        console.error('Lỗi khi lưu địa chỉ:', error);
      }
    }
  };

  const handleAddAddress = async () => {
    if (newAddress.trim()) {
      const user = auth().currentUser;
      if (user) {
        try {
          await firestore()
            .collection('users')
            .doc(user.email)
            .update({
              addresses: firestore.FieldValue.arrayUnion(newAddress),
            });
          setNewAddress('');
          setModalVisible(false);
        } catch (error) {
          console.error('Lỗi khi thêm địa chỉ:', error);
        }
      }
    }
  };

  const limitWords = (text, limit) => {
    const words = text.split(' ');
    return words.length > limit ? words.slice(0, limit).join(' ') + '...' : text;
  };

  const limitedLocation = limitWords(selectedAddress, 5);

  return (
    <View style={[styles.container, { marginTop: insets.top }]}>
      <View style={styles.shipperContainer}>
        <Icon icon="Shipper" size={40} color={colors.dark} style={styles.shipperIcon} />
        <Text style={styles.locationText}>{limitedLocation}</Text>
        <TouchableOpacity style={styles.locationButton} onPress={() => setModalVisible(true)}>
          <Icon icon="arrowBottom" size={30} style={styles.icon} />
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{title}</Text>
      <Icon icon="Notification" size={40} color={colors.dark} onPress={() => {}} />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Icon icon="close" size={30} color={colors.dark} />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Chọn địa chỉ</Text>
            {addresses.length > 0 ? (
              addresses.map((address, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.addressItem,
                    address === selectedAddress && styles.selectedAddress, // Apply style when selected
                  ]}
                  onPress={() => handleSelectAddress(address)}
                >
                  <Text style={styles.addressText}>{address}</Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noAddressText}>Chưa có địa chỉ nào</Text>
            )}
            <TextInput
              style={styles.input}
              placeholder="Nhập địa chỉ mới"
              value={newAddress}
              onChangeText={setNewAddress}
            />
            <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
              <Text style={styles.addButtonText}>Thêm địa chỉ</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default MainHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    backgroundColor: '#fff',
    paddingVertical: spacing.s,
    elevation: 3,
  },
  shipperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  shipperIcon: {
    transform: [{ scaleX: -1 }],
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationText: {
    color: colors.dark,
    marginHorizontal: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.dark,
  },
  locationButton: {
    backgroundColor: colors.light,
    borderRadius: 5,
    padding: 5,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
    position: 'relative',
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    alignSelf: 'flex-start',
  },
  addressItem: {
    alignSelf:'flex-start',
    width:'100%',
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
  },
  selectedAddress: {
    backgroundColor: colors.lightGray, 
    borderRadius:5,
    
  },
  addressText: {
    fontSize: 16,
    color: colors.primary,
  },
  noAddressText: {
    fontSize: 16,
    color: 'gray',
  },
  input: {
    width: '100%',
    padding: 10,
    marginTop: 10,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 50,
  },
  addButton: {
    marginTop: 15,
    backgroundColor: colors.primary,
    padding: 10,
    borderRadius: 5,
    alignSelf: 'flex-end',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});
