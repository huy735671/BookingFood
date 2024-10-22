import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, TouchableOpacity, Text, StyleSheet, Image } from 'react-native';
import { colors, sizes } from '../../constants/theme';

const OptionsList = () => {
  const navigation = useNavigation();
  
  // Danh sách tùy chọn với hình ảnh tương ứng
  const options = [
    {
      name: 'Trà sữa',
      image: 'https://www.nguyenlieutrasua.com/cdn/shop/articles/tra-sua-1_1024x1024.jpg?v=1699365446', 
    },
    {
      name: 'Cơm',
      image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b0/C%C6%A1m_T%E1%BA%A5m%2C_Da_Nang%2C_Vietnam.jpg/1200px-C%C6%A1m_T%E1%BA%A5m%2C_Da_Nang%2C_Vietnam.jpg', 
    },
    {
      name:'Đồ ăn nhanh',
      image: 'https://cdn.tgdd.vn/Files/2020/12/16/1314124/thuc-an-nhanh-la-gi-an-thuc-an-nhanh-co-tot-hay-khong-202201201405201587.jpg',
    },
    {
      name: 'Bún-Phở-Cháo',
      image: 'https://cdn.eva.vn/upload/4-2021/images/2021-11-19/an-sang-bun-pho-gi-cung-duoc-nhung-muon-song-den-100-tuoi-nhat-dinh-dung-bo-qua-pho-bap-bo-truyen-thong-1637308421-21-width640height427.jpg',
    },
    {
      name: 'Cà phê-Sinh tố',
      image: 'https://afamilycdn.com/150157425591193600/2022/8/10/550px-asmallcupofcoffee-16601320916371532015681.jpg',
    },
    {
      name: 'Ăn vặt',
      image: 'https://suno.vn/blog/wp-content/uploads/2017/09/4-bi-quyet-ban-do-an-vat-qua-mang-kiem-tien-trieu-moi-ngay.jpg', 
    },
    {
      name: 'Lẩu',
      image: 'https://cdn2.fptshop.com.vn/unsafe/1920x0/filters:quality(100)/2024_1_23_638416491645237808_mach-ban-cach-nau-lau-thai-bang-goi-gia-vi.jpg', 
    },
  ];

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.optionsContainer}>
      {options.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={styles.optionButton}
          onPress={() => navigation.navigate('ListFood')} 
        >
          <Image source={{ uri: option.image }} style={styles.optionImage} />
          <Text style={styles.optionText}>{option.name}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  optionsContainer: {
    marginVertical: 10,
    paddingVertical: 5,
  },
  optionButton: {
    alignItems: 'center',
    marginRight: 10,
  },
  optionImage: {
    width: 80, 
    height: 80,
    borderRadius: 10,
    marginBottom: 5,
  },
  optionText: {
    color: colors.primary,
    fontWeight: 'bold',
    fontSize:sizes.body,
  },
});

export default OptionsList;
