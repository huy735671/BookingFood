import { StyleSheet, View, Button } from 'react-native';
import React, { useState, useEffect } from 'react';
import firestore from '@react-native-firebase/firestore';
import UserList from '../component/Manage/UserList';

const UsersManage = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    // Lấy tất cả người dùng từ Firestore
    const fetchUsers = async () => {
      try {
        const snapshot = await firestore().collection('users').get();
        const usersList = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsers(usersList);
        setFilteredUsers(usersList);
      } catch (error) {
        console.error("Error fetching users: ", error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <View style={styles.container}>
      <UserList 
        users={filteredUsers} 
        setUsers={setUsers} 
        setFilteredUsers={setFilteredUsers} 
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
});

export default UsersManage;
