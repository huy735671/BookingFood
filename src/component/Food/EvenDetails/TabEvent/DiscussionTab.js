import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {colors, sizes} from '../../../../constants/theme';
import Icon from '../../../Icon';

const DiscussionTab = ({event}) => {
  const [currentUserEmail, setCurrentUserEmail] = useState(null);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);
  const [showInput, setShowInput] = useState(false); // State điều khiển hiển thị ô nhập bình luận

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('EVENTS')
      .doc(event.id)
      .collection('COMMENTS')
      .orderBy('timestamp', 'desc')
      .onSnapshot(snapshot => {
        const commentsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            fullName: data.fullName || 'Người dùng ẩn danh',
            avatarUrl: data.avatarUrl || 'https://via.placeholder.com/50',
            timestamp: data.timestamp ? data.timestamp.toDate() : new Date(),
          };
        });
        setComments(commentsData);
      });

    return () => unsubscribe();
  }, []);

  const handleSendComment = async () => {
    if (comment.trim() === '') return;

    try {
      const userDoc = await firestore()
        .collection('users')
        .doc(currentUserEmail)
        .get();

      const fullName =
        userDoc.exists && userDoc.data().fullName
          ? userDoc.data().fullName
          : 'Người dùng ẩn danh';
      const avatarUrl =
        userDoc.exists && userDoc.data().avatarUrl
          ? userDoc.data().avatarUrl
          : 'https://via.placeholder.com/50';

      await firestore()
        .collection('EVENTS')
        .doc(event.id)
        .collection('COMMENTS')
        .add({
          userEmail: currentUserEmail,
          fullName: fullName,
          text: comment,
          timestamp: firestore.FieldValue.serverTimestamp(),
          likes: 0,
          dislikes: 0,
          avatarUrl: avatarUrl,
        });

      setComment('');
      setShowInput(false); // Ẩn ô nhập bình luận sau khi gửi
    } catch (error) {
      console.error('Lỗi khi gửi bình luận:', error);
    }
  };

  const handleLike = async (commentId, likes = 0) => {
    await firestore()
      .collection('EVENTS')
      .doc(event.id)
      .collection('COMMENTS')
      .doc(commentId)
      .update({likes: (likes || 0) + 1});
  };

  const handleDislike = async (commentId, dislikes = 0) => {
    await firestore()
      .collection('EVENTS')
      .doc(event.id)
      .collection('COMMENTS')
      .doc(commentId)
      .update({dislikes: (dislikes || 0) + 1});
  };

  return (
    <View style={styles.container}>
      {/* Thanh tiêu đề "Thảo luận" và nút "Bình luận" */}
      <View style={styles.header}>
        <Text style={styles.title}>Thảo luận</Text>
        <TouchableOpacity
          onPress={() => setShowInput(!showInput)}
          style={styles.commentButton}>
          <Text style={styles.commentButtonText}>
            {showInput ? 'Đóng' : 'Bình luận'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách bình luận */}
      <FlatList
        data={comments}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <View style={styles.commentContainer}>
            <Image source={{uri: item.avatarUrl}} style={styles.avatar} />
            <View style={styles.commentContent}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.username}>{item.fullName}</Text>
                <Text style={styles.timestamp}>
                  {item.timestamp.toLocaleString()}
                </Text>
              </View>
              <Text style={styles.textText}>{item.text}</Text>

              {/* Nút Like và Dislike */}
              <View style={styles.reactionContainer}>
                <TouchableOpacity
                  onPress={() => handleLike(item.id, item.likes)}
                  style={styles.likeButton}>
                  <Icon icon="like" size={20} color={colors.primary} />
                  <Text>{item.likes ?? 0}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleDislike(item.id, item.dislikes)}
                  style={styles.dislikeButton}>
                  <Icon icon="dislike" size={20} color={colors.primary} />
                  <Text>{item.dislikes ?? 0}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />

      {/* Ô nhập bình luận chỉ hiển thị khi `showInput` là true */}
      {showInput && (
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập bình luận..."
            value={comment}
            onChangeText={setComment}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={handleSendComment}>
            <Text style={styles.sendButtonText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default DiscussionTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  commentButton: {
    backgroundColor: colors.primary,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 6,
  },
  commentButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  commentContainer: {
    flexDirection: 'row',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  commentContent: {
    flex: 1,
  },
  username: {
    fontWeight: 'bold',
    color: colors.primary,
  },
  timestamp: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  textText: {
    fontSize: sizes.body,
    color: colors.primary,
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 8,
    fontSize: 14,
    color: '#333',
  },
  sendButton: {
    backgroundColor: colors.primary,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 5,
    marginLeft: 8,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  reactionContainer: {
    flexDirection: 'row',
    marginTop: 5,
  },
  likeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 10,
  },
  dislikeButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
