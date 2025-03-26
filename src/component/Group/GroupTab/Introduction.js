import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import moment from 'moment';
import Icon from '../../Icon';

const Introduction = ({group}) => {
  // Kiểm tra nếu group không có dữ liệu
  if (!group) return <Text>Không có dữ liệu nhóm</Text>;

  // Hàm chuyển đổi Firestore Timestamp thành chuỗi ngày tháng
  const formatDate = timestamp => {
    if (!timestamp || !timestamp._seconds) return 'Chưa xác định';
    return moment(timestamp._seconds * 1000).format('DD/MM/YYYY');
  };

  return (
    <View style={styles.container}>
      {/* Thông tin nhóm */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Giới thiệu</Text>
        <View style={styles.infoBox}>
          <Text style={styles.text}>{group.groupDescription}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Ngày thành lập:</Text>
            <Text style={styles.value}>{formatDate(group.createdAt)}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Địa điểm:</Text>
            <Text style={styles.value}>{group.location}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Thành viên:</Text>
            <Text style={styles.value}>{group.members?.length || 0}</Text>
          </View>
        </View>
      </View>

      {/* Quy định nhóm */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quy định nhóm</Text>
        <View style={styles.infoBox}>
          <Text style={styles.rule}>
            1️⃣ Tôn trọng tất cả thành viên trong nhóm
          </Text>
          <Text style={styles.rule}>
            2️⃣ Không đăng nội dung quảng cáo, spam
          </Text>
          <Text style={styles.rule}>
            3️⃣ Tham gia ít nhất 1 hoạt động mỗi tháng
          </Text>
          <Text style={styles.rule}>
            4️⃣ Tuân thủ quy định an toàn khi tham gia
          </Text>
        </View>
      </View>

      {/* Quản trị viên */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quản trị viên</Text>
        <View style={styles.infoBox}>
          <View style={styles.adminRow}>
            <Text style={styles.adminName}>{group.createdBy.fullName}</Text>
            <Text style={styles.adminRole}>Quản trị viên</Text>
          </View>
        </View>
      </View>
      <View style={styles.footerContainer}>
        <Icon icon="info" size={20} />
        <Text style={{marginLeft:5,color:'#2e7d32'}}>Về nhóm của chúng tôi</Text>
        <Text style={{marginLeft:25,}}>
          Biển Xanh Sạch là một nhóm tình nguyện phi lợi nhuận, hoạt động vì mục
          tiêu bảo vệ môi trường biển và nâng cao nhận thức cộng đồng về vấn đề
          ô nhiễm biển.
        </Text>
      </View>
    </View>
  );
};

// **📌 CSS Styles**
const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#f8fdf6',
  },
  groupImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#2e7d32',
  },
  infoBox: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#555',
  },
  value: {
    fontSize: 14,
    color: '#000',
  },
  rule: {
    fontSize: 14,
    color: '#444',
    marginBottom: 3,
  },
  adminRow: {
    flexDirection: 'column',
    paddingVertical: 5,
  },
  adminName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2e7d32',
  },
  adminRole: {
    fontSize: 12,
    color: '#666',
  },
  footerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#e8f5e9',
    borderRadius: 8,
    marginTop: 10,
    flexWrap: 'wrap',
  },
});

export default Introduction;
