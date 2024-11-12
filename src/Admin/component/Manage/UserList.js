import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput, TouchableOpacity } from 'react-native';
import firestore from '@react-native-firebase/firestore';
import { colors, sizes } from '../../../constants/theme';
import Icon from '../../../component/Icon';
import { PanGestureHandler, ScrollView } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import { Dropdown } from 'react-native-element-dropdown';

const UserList = ({ users, setUsers }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all'); 
  const [filteredUsers, setFilteredUsers] = useState(users);
  const [showDropdown, setShowDropdown] = useState(null);
  const navigation = useNavigation();
  useEffect(() => {
    setFilteredUsers(users);
  }, [users]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    filterUsers(query, selectedRole);
  };

  const handleRoleFilter = (role) => {
    setSelectedRole(role);
    filterUsers(searchQuery, role);
  };

  const filterUsers = (query, role) => {
    let filtered = users;
    if (query) {
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().includes(query.toLowerCase())
      );
    }
    if (role && role !== 'all') {
      filtered = filtered.filter((user) => user.role === role);
    }
    setFilteredUsers(filtered);
  };

  const handleEdit = (userId) => {
    const userToEdit = users.find((user) => user.id === userId);
    if (userToEdit) {
      navigation.navigate('EditUserScreen', { user: userToEdit });
    }
  };
  

  const handleDelete = (userId) => {
    console.log('Delete user with ID:', userId);
    firestore()
      .collection('users')
      .doc(userId)
      .delete()
      .then(() => {
        setUsers(users.filter((user) => user.id !== userId));
        setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
      })
      .catch((error) => {
        console.error('Error deleting user: ', error);
      });
  };

  const toggleDropdown = (userId) => {
    setShowDropdown((prevState) => (prevState === userId ? null : userId));
  };

  const translateRole = (role) => {
    switch (role) {
      case 'admin':
        return 'Quản trị';
      case 'partner':
        return 'Chủ cửa hàng';
      case 'user':
        return 'Người dùng';
      default:
        return role;
    }
  };

  const translateFilter = (role) => {
    switch (role) {
      case 'admin':
        return 'Quản trị';
      case 'partner':
        return 'Chủ cửa hàng';
      case 'user':
        return 'Người dùng';
      default:
        return 'Tất cả';
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Tìm kiếm người dùng theo email..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.addButton} onPress={()=>navigation.navigate('addUser')}>
          <Icon icon="Add" size={30} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.filterContainer}>
        <PanGestureHandler>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['all', 'admin', 'user', 'partner'].map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.filterButton,
                  selectedRole === role && styles.selectedFilterButton,
                ]}
                onPress={() => handleRoleFilter(role)}>
                <Text
                  style={[
                    styles.filterText,
                    selectedRole === role && styles.selectedFilterText,
                  ]}>
                  {translateFilter(role)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </PanGestureHandler>
      </View>

      <FlatList
      showsVerticalScrollIndicator={false}
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View style={styles.headerContainer}>
              <Text style={styles.userText}>{item.fullName}</Text>
              <TouchableOpacity onPress={() => toggleDropdown(item.id)}>
                <Text style={styles.actionText}>
                  Hành động <Icon icon="arrowBottom" size={30} />
                </Text>
              </TouchableOpacity>
              {showDropdown === item.id && (
                <View style={styles.dropdown}>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleEdit(item.id)}>
                    <Text style={styles.dropdownText}>Chỉnh sửa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => handleDelete(item.id)}>
                    <Text style={styles.dropdownText}>Xóa</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
            <Text style={styles.sectionText}>{item.email}</Text>
            <Text style={styles.sectionText}>{translateRole(item.role)}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  searchInput: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 10,
    borderColor: '#ddd',
    flex: 1,
  },
  addButton: {
    marginLeft: 10,
    padding: 10,
    backgroundColor: colors.green,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginBottom: 20,
    borderWidth: 1,
    padding: 2,
    borderColor: '#ddd',
    borderRadius: 5,
  },
  filterButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderColor: '#ddd',
    marginRight: 10, 
  },
  selectedFilterButton: {
    backgroundColor: colors.green,
    borderRadius: 5,
  },
  filterText: {
    fontSize: sizes.h3,
    color: colors.primary,
    fontWeight: 'bold',
  },
  selectedFilterText: {
    color: 'white',
  },
  userItem: {
    marginBottom: 15,
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  userText: {
    fontWeight: 'bold',
    fontSize: sizes.h2,
    color: colors.primary,
  },
  actionText: {
    fontSize: sizes.h3,
    color: colors.primary,
    fontWeight: 'bold',
    borderWidth: 1,
    paddingHorizontal: 10,
    padding: 5,
    borderRadius: 10,
    borderColor: '#ddd',
  },
  dropdown: {
    position: 'absolute',
    top: 40,
    right: 0,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    width: 150,
  },
  dropdownItem: {
    paddingVertical: 10,
  },
  dropdownText: {
    fontSize: 14,
    color: colors.primary,
    textAlign: 'left',
    fontWeight: 'bold',
  },
  sectionText: {
    fontSize: sizes.h3,
    color: colors.gray,
  },
});

export default UserList;
