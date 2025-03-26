import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {colors, sizes} from '../../../constants/theme';

const categories = [
  'Tất cả',
  'Sản phẩm eco',
  'Voucher',
  'Trải nghiệm',
  'Đóng góp',
];

const HistoryScreen = ({route}) => {
  const {userEmail} = route.params;
  const [userPoints, setUserPoints] = useState(0);
  const [usedPoints, setUsedPoints] = useState(0);
  const [totalEarnedPoints, setTotalEarnedPoints] = useState(0);
  const [historyData, setHistoryData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchUserPoints = async () => {
      const userDoc = await firestore()
        .collection('USER_POINTS')
        .doc(userEmail)
        .get();
      if (userDoc.exists) {
        setUserPoints(userDoc.data().points || 0);
      }
    };

    const fetchUserGifts = async () => {
      const snapshot = await firestore()
        .collection('USER_GIFTS')
        .where('email', '==', userEmail)
        .get();

      let totalUsedPoints = 0;
      let gifts = [];

      // Lấy danh sách giftId từ USER_GIFTS
      const giftIds = snapshot.docs.map(doc => doc.data().giftId);

      // Fetch thông tin từ GIFTS
      const giftDetailsPromises = giftIds.map(async giftId => {
        const giftDoc = await firestore().collection('GIFTS').doc(giftId).get();
        return giftDoc.exists ? {id: giftId, ...giftDoc.data()} : null;
      });

      const giftDetails = await Promise.all(giftDetailsPromises);

      snapshot.forEach((doc, index) => {
        const data = doc.data();
        const giftDetail = giftDetails[index];

        if (giftDetail) {
          totalUsedPoints += data.giftPoints || 0;
          gifts.push({
            id: doc.id,
            name: data.giftName,
            points: data.giftPoints,
            category: data.category || 'Tất cả',
            exchangeDate: data.exchangeDate
              ? new Date(data.exchangeDate.toMillis()).toLocaleDateString(
                  'vi-VN',
                )
              : 'Không có dữ liệu',
            image: giftDetail.image || null,
            description: giftDetail.description || 'Không có mô tả',
          });
        }
      });

      setUsedPoints(totalUsedPoints);
      setHistoryData(gifts);
    };

    const fetchTotalEarnedPoints = async () => {
      let totalPoints = 0;

      const userTasksSnapshot = await firestore()
        .collection('USER_TASKS')
        .where('email', '==', userEmail)
        .get();

      userTasksSnapshot.forEach(doc => {
        const data = doc.data();
        totalPoints += data.rewardPoints || 0;
      });

      const historyEventsSnapshot = await firestore()
        .collection('HISTORY_EVENTS')
        .where('email', '==', userEmail)
        .get();

      historyEventsSnapshot.forEach(doc => {
        const data = doc.data();
        totalPoints += data.completionPoints || 0;
      });

      setTotalEarnedPoints(totalPoints);
    };

    fetchUserPoints();
    fetchUserGifts();
    fetchTotalEarnedPoints();
  }, [userEmail]);

  const filteredHistory = historyData.filter(
    item =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedCategory === 'Tất cả' || item.category === selectedCategory),
  );

  return (
    <View style={styles.container}>
      <View style={styles.pointsContainer}>
        <View style={styles.pointsTextContainer}>
          <Text style={styles.pointsText}>Điểm hiện có</Text>
          <Text style={styles.pointsTextPoints}>{userPoints}</Text>
        </View>
        <View style={styles.pointsTextContainer}>
          <Text style={styles.pointsText}>Tổng điểm đã tích</Text>
          <Text style={styles.pointsTextPoints}>{totalEarnedPoints}</Text>
        </View>
        <View style={styles.pointsTextContainer}>
          <Text style={styles.pointsText}>Điểm đã dùng</Text>
          <Text style={styles.pointsTextPoints}>{usedPoints}</Text>
        </View>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Tìm kiếm lịch sử đổi điểm"
        value={searchQuery}
        onChangeText={setSearchQuery}
      />

      {/* Thanh Tab Categories */}
      <FlatList
        data={categories}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item}
        contentContainerStyle={{paddingVertical: 8}}
        style={{flexGrow: 0}}
        renderItem={({item}) => (
          <TouchableOpacity
            style={[
              styles.categoryTab,
              selectedCategory === item && styles.selectedCategory,
            ]}
            onPress={() => setSelectedCategory(item)}>
            <Text
              style={[
                styles.categoryText,
                selectedCategory === item && styles.selectedCategoryText,
              ]}>
              {item}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FlatList
        data={historyData.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()),
        )}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            onPress={() => {
              setSelectedVoucher(item);
              setModalVisible(true);
            }}
            style={styles.itemContainer}>
            {item.image && (
              <Image
                source={{uri: item.image}}
                style={styles.itemImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.itemTextContainer}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPoints}>-{item.points} điểm</Text>
              <Text style={styles.exchangeDate}>
                Đã đổi thưởng ngày: {item.exchangeDate}
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />

      {/* Modal hiển thị chi tiết voucher */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.title}>Chi tiết đổi điểm</Text>

            {selectedVoucher && (
              <>
                <View style={styles.modalHeader}>
                  {selectedVoucher.image && (
                    <Image
                      source={{uri: selectedVoucher.image}}
                      style={styles.modalImage}
                    />
                  )}
                  <View style={styles.modalTextContainer}>
                    <Text style={styles.modalTitle}>
                      {selectedVoucher.name}
                    </Text>
                    <Text style={styles.modalPoints}>
                      -{selectedVoucher.points} điểm
                    </Text>
                  </View>
                </View>

                <View style={styles.exchangeDateContainer}>
                  <Text style={styles.modalDate}>Ngày đổi điểm:</Text>
                  <Text style={styles.titleBody}>
                    {selectedVoucher.exchangeDate}
                  </Text>
                </View>

                <View style={styles.exchangeDateContainer}>
                  <Text style={styles.modalDate}>Mô tả:</Text>
                </View>
                <Text style={styles.description}>
                  {selectedVoucher.description}
                </Text>

                {selectedVoucher.randomCode ? (
                  <View style={styles.exchangeDateContainer}>
                    <Text style={styles.modalDate}>Mã voucher:</Text>
                    <Text style={styles.titleBody}>
                      {selectedVoucher.randomCode}
                    </Text>
                  </View>
                ) : null}

                {selectedVoucher.expirationDate ? (
                  <View style={styles.exchangeDateContainer}>
                    <Text style={styles.modalDate}>Hạn sử dụng:</Text>
                    <Text style={styles.titleBody}>
                      {selectedVoucher.expirationDate} từ ngày đổi
                    </Text>
                  </View>
                ) : null}

                <Text style={styles.footerText}>
                  Voucher của bạn đang hoạt động và có thể sử dụng đến ngày hết
                  hạn.
                </Text>

                <Pressable
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}>
                  <Text style={styles.closeButtonText}>Đóng</Text>
                </Pressable>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 6,
  },
  pointsContainer: {
    backgroundColor: '#E6F4EA',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pointsTextContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  pointsText: {
    fontSize: sizes.body,
    fontWeight: 'bold',
    color: '#333',
  },
  pointsTextPoints: {
    fontSize: sizes.h3,
    color: colors.green,
    fontWeight: 'bold',
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  categoryTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 8,
  },
  selectedCategory: {
    backgroundColor: colors.green,
  },
  categoryText: {
    fontSize: 14,
    color: '#333',
  },
  selectedCategoryText: {
    color: '#fff',
    fontWeight: 'bold',
  },

  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },

  itemContainer: {
    backgroundColor: '#F9F9F9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  itemTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  itemPoints: {
    fontSize: 14,
    color: colors.gray,
  },
  itemDate: {
    fontSize: 12,
    color: '#666',
  },
  exchangeDate: {
    color: colors.green,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  title: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    color: colors.primary,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  modalImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  modalTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  modalPoints: {
    fontSize: 14,
    color: colors.gray,
  },
  exchangeDateContainer: {
    alignSelf: 'flex-start',
    marginVertical: 10,
  },
  modalDate: {
    fontSize: 14,
    color: colors.green,
    textAlign: 'center',
  },
  description:{
    fontSize:sizes.body,
    color:colors.primary,

  },
  titleBody: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize: sizes.h3,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: colors.green,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerText: {
    padding: 5,
    color: '#4e76e1',
    backgroundColor: '#eff6ff',
    marginTop:10,
    borderRadius:6,
  },
});

export default HistoryScreen;
