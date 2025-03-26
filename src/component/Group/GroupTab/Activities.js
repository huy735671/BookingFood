import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ActivityIndicator,
  Image,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import {ProgressBar} from 'react-native-paper';
import {colors, sizes} from '../../../constants/theme';

const DEFAULT_AVATAR =
  'https://media.istockphoto.com/id/1288129985/vi/vec-to/thiếu-hình-ảnh-của-trình-giữ-chỗ-cho-một-người.jpg?s=612x612&w=0&k=20&c=2mBRPdxj9u08XRt8L9iu-iLgDEV-ts3uqkkG2ReteTw=';

const Activities = ({group}) => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContributors = async () => {
      if (!group?.id) return;

      try {
        setLoading(true);
        const pointsSnapshot = await firestore()
          .collection('POINT_EVENT_GROUPS')
          .where('groupId', '==', group.id)
          .get();

        let allContributors = [];

        for (let docSnap of pointsSnapshot.docs) {
          const {totalPoints, userId} = docSnap.data();
          if (!userId) continue;

          const userSnap = await firestore()
            .collection('users')
            .doc(userId)
            .get();
          if (userSnap.exists) {
            const userData = userSnap.data();
            allContributors.push({
              id: userId,
              fullName: userData.fullName || 'Người dùng ẩn danh',
              avatar: userData.avatar || DEFAULT_AVATAR,
              totalPoints,
            });
          }
        }

        allContributors.sort((a, b) => b.totalPoints - a.totalPoints);
        setContributors(allContributors);
      } catch (error) {
        console.error('Lỗi khi tải dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributors();
  }, [group]);

  return (
    <View>
      <ImageBackground
        source={{
          uri: 'https://www.lumina.com.ph/assets/news-and-blogs-photos/UN-Policies-about-Environment-and-their-Impact/OG-UN-Policies-about-Environment-and-their-Impact.png',
        }}
        style={styles.background}
        resizeMode="cover">
        <View style={styles.overlay}>
          <Text style={styles.tag}>Vinh danh</Text>
          <Text style={styles.title}>Chiến binh Xuất sắc</Text>
          <Text style={styles.subtitle}>
            Những thành viên có đóng góp nổi bật trong nhóm
          </Text>
        </View>
      </ImageBackground>

      <View style={styles.topContributorsContainer}>
        <Text style={styles.topTitle}>Top đóng góp</Text>

        {loading ? (
          <ActivityIndicator size="large" color="green" />
        ) : contributors.length > 0 ? (
          <View style={styles.topContainer}>
            {/* Top 2 - Bên trái */}
            {contributors[1] && (
              <View style={[styles.contributor, styles.secondPlace]}>
                <View style={styles.avatarContainer}>
                  <Image
                    source={{uri: contributors[1]?.avatar}}
                    style={styles.avatarImage}
                  />
                  <View style={[styles.badge, styles.silverBadge]}>
                    <Text style={styles.badgeText}>2</Text>
                  </View>
                </View>
                <Text style={styles.contributorName}>
                  {contributors[1]?.fullName}
                </Text>
                <Text style={styles.contributorPoints}>
                  {contributors[1]?.totalPoints} đóng góp
                </Text>
              </View>
            )}

            {/* Top 1 - Ở giữa */}
            {contributors[0] && (
              <View style={[styles.contributor, styles.firstPlace]}>
                <View style={styles.avatarContainer1}>
                  <Image
                    source={{uri: contributors[0]?.avatar}}
                    style={styles.avatarImage}
                  />
                  <View style={[styles.badge, styles.goldBadge]}>
                    <Text style={styles.badgeText}>1</Text>
                  </View>
                </View>
                <Text style={styles.contributorName}>
                  {contributors[0]?.fullName}
                </Text>
                <Text style={styles.contributorPoints}>
                  {contributors[0]?.totalPoints} đóng góp
                </Text>
              </View>
            )}

            {/* Top 3 - Bên phải */}
            {contributors[2] && (
              <View style={[styles.contributor, styles.thirdPlace]}>
                <View style={styles.avatarContainer2}>
                  <Image
                    source={{uri: contributors[2]?.avatar}}
                    style={styles.avatarImage}
                  />
                  <View style={[styles.badge, styles.bronzeBadge]}>
                    <Text style={styles.badgeText}>3</Text>
                  </View>
                </View>
                <Text style={styles.contributorName}>
                  {contributors[2]?.fullName}
                </Text>
                <Text style={styles.contributorPoints}>
                  {contributors[2]?.totalPoints} đóng góp
                </Text>
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.noData}>Đang cập nhật danh sách</Text>
        )}
      </View>

      <Text style={styles.allTitle}>Tất cả thành viên đóng góp</Text>
      {/* Danh sách tất cả thành viên đóng góp */}
      <View style={styles.allDonate}>
        {loading ? (
          <ActivityIndicator size="large" color="green" />
        ) : (
          <FlatList
            data={contributors}
            keyExtractor={item => item.id}
            renderItem={({item, index}) => {
              const progress = Math.min(item.totalPoints / 30, 1);

              return (
                <View style={styles.listItem}>
                  <View
                    style={[
                      styles.rankContainer,
                      index < 3
                        ? styles[`badge${index + 1}`]
                        : styles.defaultBadge,
                    ]}>
                    <Text style={styles.rankText}>{index + 1}</Text>
                  </View>

                  <Image
                    source={{uri: item.avatar}}
                    style={styles.listAvatar}
                  />

                  <View style={styles.listText}>
                    <Text style={styles.listName}>{item.fullName}</Text>
                    <Text style={styles.listPoints}>
                      {item.totalPoints} đóng góp
                    </Text>
                    <ProgressBar
                      progress={progress}
                      color="green"
                      style={styles.progressBar}
                    />
                  </View>
                </View>
              );
            }}
            scrollEnabled={false}
          />
        )}
      </View>
    </View>
  );
};

export default Activities;

const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: 150,
    justifyContent: 'center',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  tag: {
    backgroundColor: 'green',
    color: 'white',
    fontWeight: 'bold',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  title: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
  topContributorsContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  contributor: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: 100,
  },
  firstPlace: {
    zIndex: 3,
  },
  secondPlace: {
    marginTop: 10, 
    transform: [{ translateX: 30 },{ translateY: -20 },{ scale: 0.8 }], 
  },
  thirdPlace: {
    marginTop: 10, 
    transform: [{ translateX: -30 },{ translateY: -20 },{ scale: 0.8 }], 
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 5,
    borderWidth:2,
    borderRadius:40,
    borderColor:'#C0C0C0',
  },
  avatarContainer1: {
    position: 'relative',
    marginBottom: 5,
    borderWidth:5,
    borderRadius:50,
    borderColor:'#FFC107',
  },
  avatarContainer2: {
    position: 'relative',
    marginBottom: 5,
    borderWidth:2,
    borderRadius:40,
    borderColor:'#CD7F32',
  },
  avatarImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  
  badge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 26,
    height: 26,
    borderRadius: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  goldBadge: {
    backgroundColor: '#FFC107',
  },
  silverBadge: {
    backgroundColor: '#C0C0C0',
  },
  bronzeBadge: {
    backgroundColor: '#CD7F32',
  },
  badgeText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  contributorName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 5,
  },
  contributorPoints: {
    fontSize: 12,
    color: 'gray',
    textAlign: 'center',
  },
  allTitle: {
    fontWeight: 'bold',
    fontSize: sizes.h3,
    color: colors.primary,
    marginLeft: 5,
    marginVertical: 10,
  },
  allDonate: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  rankContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  defaultBadge: {
    backgroundColor: '#ddd',
  },
  badge1: {
    backgroundColor: '#FFC107', 
  },
  badge2: {
    backgroundColor: '#C0C0C0',
  },
  badge3: {
    backgroundColor: '#CD7F32', 
  },
  rankText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
    borderWidth: 2,
    borderColor: '#ccc',
  },
  listText: {
    flex: 1,
  },
  listName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  listPoints: {
    fontSize: 14,
    color: 'gray',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
    marginTop: 5,
    width: '100%',
    backgroundColor: '#ddd',
  },
});
