import React from "react";
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from "react-native";
import { differenceInDays } from "date-fns";

const ParticipantsTab = ({ event }) => {
  const participants = event?.members || [];
  const maxParticipants = event?.maxParticipants || 100;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách người tham gia</Text>
        <Text style={styles.count}>{participants.length}/{maxParticipants}</Text>
      </View>

      {participants.length === 0 ? (
        <Text style={styles.noParticipants}>Chưa có ai tham gia</Text>
      ) : (
        <FlatList
          data={participants}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            const registrationDate = item.registrationDate?.toDate?.() || new Date();
            let daysAgo = differenceInDays(new Date(), registrationDate);
            daysAgo = Math.max(daysAgo, 1); // Đảm bảo ít nhất là 1 ngày

            return (
              <View style={styles.participantItem}>
                <Image
                  source={{ uri: item.avatar || "https://media.istockphoto.com/id/1288129985/vi/vec-to/thi%E1%BA%BFu-h%C3%ACnh-%E1%BA%A3nh-c%E1%BB%A7a-tr%C3%ACnh-gi%E1%BB%AF-ch%E1%BB%97-cho-m%E1%BB%99t-ng%C6%B0%E1%BB%9Di.jpg?s=612x612&w=0&k=20&c=2mBRPdxj9u08XRt8L9iu-iLgDEV-ts3uqkkG2ReteTw=" }}
                  style={styles.avatar}
                />
                <View style={styles.info}>
                  <Text style={styles.name}>{item.fullName}</Text>
                  <Text style={styles.time}>Đã tham gia {daysAgo} ngày trước</Text>
                </View>
                <TouchableOpacity style={styles.viewButton}>
                  <Text style={styles.viewText}>Xem</Text>
                </TouchableOpacity>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

export default ParticipantsTab;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#F8F9FA",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    backgroundColor: "#EAF8E6",
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#228B22",
  },
  count: {
    fontSize: 16,
    color: "#6AB04C",
    fontWeight: "bold",
  },
  noParticipants: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  participantItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  time: {
    fontSize: 14,
    color: "gray",
  },
  viewButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  viewText: {
    fontSize: 16,
    color: "#228B22",
    fontWeight: "bold",
  },
});
