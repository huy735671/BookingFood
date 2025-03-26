import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Icon from '../../Icon';
import { colors } from '../../../constants/theme';
import firestore from '@react-native-firebase/firestore';

const handleGiftExchange = async (gift, userEmail, userPoints, onClose) => {
  try {
    
    const usersPointsRef = firestore().collection('USER_POINTS');
    const usersGiftsRef = firestore().collection('USER_GIFTS');

    const allUsersPointsQuery = await usersPointsRef.get();
    console.log('Total Users in USERS_POINTS:', allUsersPointsQuery.size);
    allUsersPointsQuery.docs.forEach(doc => {
      console.log('Existing User:', doc.data().email);
    });

    const userPointsQuery = await usersPointsRef
      .where('email', '==', userEmail)
      .limit(1)
      .get();

    if (userPointsQuery.empty) {
      const newUserPointsDoc = await usersPointsRef.add({
        email: userEmail,
        points: userPoints  
      });

      console.log('Created new user points document:', newUserPointsDoc.id);

      const newPoints = userPoints - gift.points;
      if (newPoints < 0) {
        await newUserPointsDoc.delete();  
        Alert.alert('Lỗi', 'Không đủ điểm để đổi quà');
        return false;
      }

      await newUserPointsDoc.update({ points: newPoints });

      await usersGiftsRef.add({
        giftId: gift.id,
        email: userEmail,
        exchangeDate: firestore.FieldValue.serverTimestamp(),
        giftName: gift.name,
        giftPoints: gift.points
      });

      Alert.alert('Thành công', `Bạn đã đổi thành công ${gift.name}`);
      onClose();
      return true;
    }

    const userPointsDoc = userPointsQuery.docs[0];
    const currentPoints = userPointsDoc.data().points;

    if (currentPoints < gift.points) {
      Alert.alert('Thông báo', 'Bạn không đủ điểm để đổi quà');
      return false;
    }

    const newPoints = currentPoints - gift.points;

    await userPointsDoc.ref.update({
      points: newPoints
    });

    await usersGiftsRef.add({
      giftId: gift.id,
      email: userEmail,
      exchangeDate: firestore.FieldValue.serverTimestamp(),
      giftName: gift.name,
      giftPoints: gift.points
    });

    if (gift.stock) {
      const giftRef = firestore().collection('GIFTS').doc(gift.id);
      await giftRef.update({
        stock: firestore.FieldValue.increment(-1)
      });
    }

    Alert.alert('Thành công', `Bạn đã đổi thành công ${gift.name}`);
    onClose();
    return true;

  } catch (error) {
    console.error('Detailed Exchange Error:', error);
    Alert.alert('Lỗi', 'Chi tiết lỗi: ' + error.message);
    return false;
  }
};

const GiftDetailModal = ({visible, onClose, gift, userPoints, userEmail}) => {

  const [isExchanging, setIsExchanging] = useState(false);

  if (!gift) return null; 


  const canRedeem = userPoints >= gift.points;

  const onExchangePress = async () => {
    if (!canRedeem) return;

    setIsExchanging(true);
    try {
      await handleGiftExchange(gift, userEmail, userPoints, onClose);
    } catch (error) {
      console.error('Exchange error:', error);
    } finally {
      setIsExchanging(false);
    }
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <View style={styles.imageWrapper}>
            {gift.image ? (
              <Image source={{uri: gift.image}} style={styles.giftImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Text style={styles.placeholderText}>Không có ảnh</Text>
              </View>
            )}
          </View>

          <View style={styles.contentContainer}>
            <Text style={styles.giftTitle}>{gift.name}</Text>
            <Text style={styles.giftPoints}>{gift.points} điểm</Text>
            
            {gift.description ? (
              <Text style={styles.description}>{gift.description}</Text>
            ) : null}

            {gift.stock ? (
              <Text style={styles.infoText}>
                Còn lại:{' '}
                <Text style={styles.boldText}>{gift.stock} sản phẩm</Text>
              </Text>
            ) : null}

            {gift.deliveryTime ? (
              <Text style={styles.infoText}>
                Thời gian giao hàng:{' '}
                <Text style={styles.boldText}>{gift.deliveryTime}</Text>
              </Text>
            ) : null}

            {gift.expirationDate ? (
              <Text style={styles.infoText}>
                Hạn sử dụng:{' '}
                <Text style={styles.boldText}>
                  {gift.expirationDate} ngày kể từ ngày đổi
                </Text>
              </Text>
            ) : null}

            {canRedeem ? (
              <View style={styles.notice}>
                <Icon icon="checked" size={20} color={colors.green} />
                <Text style={styles.noticeText}>
                  Bạn có đủ điểm để đổi phần thưởng này
                </Text>
              </View>
            ) : (
              <View style={[styles.notice, {backgroundColor: '#ffdddd'}]}>
                <Icon icon="close" size={20} color={colors.red} />
                <Text style={[styles.noticeText, {color: '#a00'}]}>
                  Bạn cần thêm {gift.points - userPoints} điểm để đổi quà này
                </Text>
              </View>
            )}
          </View>

          {/* Cancel & Exchange Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={styles.cancelButton} 
              onPress={onClose}
              disabled={isExchanging}
            >
              <Text style={styles.buttonText}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.exchangeButton,
                (!canRedeem || isExchanging) && {backgroundColor: '#bbb'},
              ]}
              disabled={!canRedeem || isExchanging}
              onPress={onExchangePress}
            >
              <Text style={styles.buttonText}>
                {isExchanging ? 'Đang đổi...' : `Đổi ${gift.points} điểm`}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '90%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
  },
  imageWrapper: {
    width: '100%',
    height: 150,
    backgroundColor: '#f3f3f3',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  giftImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#999',
    fontSize: 14,
  },
  contentContainer: {
    alignItems: 'flex-start', // Align left all content
    marginVertical: 10,
  },
  giftTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  giftPoints: {
    fontSize: 16,
    color: '#28a745',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginVertical: 10,
  },
  infoText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  boldText: {
    fontWeight: 'bold',
  },
  notice: {
    flexDirection: 'row',
    backgroundColor: '#dfffd6',
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
  },
  noticeText: {
    color: '#2d7a2d',
    fontSize: 14,
    marginLeft: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  cancelButton: {
    backgroundColor: '#fff',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 1,
    marginRight: 10,
    borderColor: '#ddd',
  },
  exchangeButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default GiftDetailModal;