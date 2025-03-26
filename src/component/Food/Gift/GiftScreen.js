import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
  ScrollView,
  Image,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {colors, sizes} from '../../../constants/theme';
import GiftDetailModal from './GiftDetailModal';
import {useNavigation} from '@react-navigation/native';

const categories = [
  {id: 'all', name: 'Tất cả'},
  {id: 'Sản phẩm eco', name: 'Sản phẩm eco'},
  {id: 'Voucher', name: 'Voucher'},
  {id: 'Trải nghiệm', name: 'Trải nghiệm'},
  {id: 'Quyên góp', name: 'Quyên góp'},
];

const GiftScreen = ({route}) => {
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [gifts, setGifts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedGift, setSelectedGift] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const navigation = useNavigation();
  const {userEmail} = route.params;

  const fetchUserPoints = async () => {
    try {
      setLoading(true);

      const unsubscribe = firestore()
        .collection('USER_POINTS')
        .doc(userEmail)
        .onSnapshot(
          doc => {
            if (doc.exists) {
              setUserPoints(doc.data().points || 0);
            } else {
              setUserPoints(0);
            }
            setLoading(false);
          },
          error => {
            console.error('Lỗi khi lấy điểm người dùng:', error);
            setLoading(false);
          },
        );

      return unsubscribe;
    } catch (error) {
      console.error('Lỗi khi thiết lập lắng nghe điểm:', error);
      setLoading(false);
    }
  };

  const fetchGifts = async category => {
    try {
      setLoading(true);
      let query = firestore().collection('GIFTS');

      if (category !== 'all') {
        query = query.where('category', '==', category);
      }

      const snapshot = await query.get();
      const giftList = snapshot.docs.map(doc => ({id: doc.id, ...doc.data()}));
      setGifts(giftList);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách quà:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userEmail) {
      fetchUserPoints();
      fetchGifts(selectedCategory);
    }
  }, [userEmail, selectedCategory]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.headerCard}>
          <View>
            <Text style={styles.title}>Điểm hiện có</Text>
            <Text style={styles.pointsText}>{userPoints}</Text>
          </View>
          <TouchableOpacity
            style={styles.historyButton}
            onPress={() =>
              navigation.navigate('HistoryScreen', {userEmail, userPoints})
            }>
            <Text style={styles.historyText}>Lịch sử đổi điểm</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.progressBarContainer}>
          <Text style={styles.levelText}>Cấp 3</Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progress,
                {width: `${(userPoints / 10000) * 100}%`},
              ]}
            />
          </View>
          <Text style={styles.levelText}>Cấp 4</Text>
        </View>
      </View>

      {/* Bộ lọc */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map(cat => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.filterButton,
                selectedCategory === cat.id && styles.activeFilter,
              ]}
              onPress={() => setSelectedCategory(cat.id)}>
              <Text
                style={[
                  styles.filterText,
                  selectedCategory === cat.id && styles.activeFilterText,
                ]}>
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Danh sách quà */}
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <FlatList
          data={gifts}
          keyExtractor={item => item.id}
          numColumns={2} // Chia làm 2 cột
          columnWrapperStyle={styles.row} // Tạo khoảng cách giữa các cột
          renderItem={({item}) => (
            <View style={styles.giftItem}>
              <View style={styles.imageContainer}>
                <Image source={{uri: item.image}} style={styles.giftImage} />
              </View>
              <View style={styles.infoContainer}>
                <Text style={styles.giftTitle}>{item.name}</Text>
                <View style={styles.bottomContainer}>
                  <Text style={styles.giftPoints}>{item.points} điểm</Text>
                  <TouchableOpacity
                    style={{
                      backgroundColor: '#28a745',
                      paddingVertical: 5,
                      paddingHorizontal: 12,
                      borderRadius: 5,
                      marginTop: 5,
                    }}
                    onPress={() => {
                      if (!modalVisible) {
                        // Kiểm tra nếu modal chưa mở thì mới mở
                        setSelectedGift(item);
                        setModalVisible(true);
                      }
                    }}>
                    <Text
                      style={{color: '#fff', fontSize: 14, fontWeight: 'bold'}}>
                      Đổi
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          )}
        />
      )}

      <GiftDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        gift={selectedGift}
        userPoints={userPoints}
        userEmail={userEmail}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#E6F4EA',
    padding: 15,
    borderRadius: 10,
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: sizes.h3,
    fontWeight: 'bold',
    color: colors.green,
  },
  pointsText: {
    fontSize: sizes.h2,
    fontWeight: 'bold',
    color: colors.green,
    alignSelf: 'center',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginTop: 10,
  },
  levelText: {
    fontSize: sizes.h4,
    color: colors.green,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: '#D3D3D3',
    borderRadius: 5,
    marginHorizontal: 10,
  },
  progress: {
    height: '100%',
    backgroundColor: colors.green,
    borderRadius: 5,
  },

  historyButton: {
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
    marginTop: 10,
    alignSelf: 'center',
  },
  historyText: {
    fontSize: sizes.h4,
    color: colors.green,
    fontWeight: 'bold',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  activeFilter: {
    backgroundColor: colors.green,
  },
  filterText: {
    fontSize: sizes.h4,
    color: '#000',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  row: {
    flex: 1,
    justifyContent: 'space-between', // Khoảng cách giữa 2 cột
    marginBottom: 10,
  },
  giftItem: {
    width: '45%', // 2 cột với khoảng cách hợp lý
    backgroundColor: '#fff',
    borderRadius: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: {width: 0, height: 2},
    elevation: 2, // Bóng đổ cho Android
    marginHorizontal: 5,
  },
  imageContainer: {
    width: '100%',
    height: 100, // Đặt chiều cao cố định cho ảnh
    backgroundColor: '#f0f0f0', // Màu nền nếu ảnh chưa load
    justifyContent: 'center',
    alignItems: 'center',
  },
  giftImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    padding: 10,
  },
  giftTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'left',
    marginBottom: 5,
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  giftPoints: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#28a745',
  },
  exchangeButton: {
    backgroundColor: '#28a745',
    paddingVertical: 5,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  exchangeText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },

  filterContainer: {
    marginVertical: 10,
    paddingHorizontal: 10,
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    marginRight: 10,
  },
  activeFilter: {
    backgroundColor: colors.green,
  },
  filterText: {
    fontSize: sizes.h4,
    color: '#000',
  },
  activeFilterText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default GiftScreen;
