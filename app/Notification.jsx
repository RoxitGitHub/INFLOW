import { View, Text, FlatList, StyleSheet, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { getNotificationInbox } from 'native-notify';

export default function Notification() {
  const [data, setData] = useState([]);
  const takeNumber = 10; // Define the number of notifications to take
  const skipNumber = 0; // Define the number of notifications to skip

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        console.log("Fetching notifications...");
        const notifications = await getNotificationInbox(28253, 'JrOfhcd94dTTzAkUCuABGw', takeNumber, skipNumber);
        console.log("Notifications fetched: ", notifications);
        setData(notifications);
      } catch (error) {
        console.error("Error fetching notifications: ", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.notification}>
            <Image
              source={require('./../assets/images/logo.png')} // Replace with the path to your image in the assets folder
              style={styles.avatar}
            />
            <View style={styles.content}>
              <Text style={styles.notificationTitle}>{item.title}</Text>
              <Text style={styles.notificationMessage}>{item.message}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
    marginTop: 2,
  },
  notification: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: 30,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingTop: 25,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#3c3c3c',
    marginBottom: 4,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#6c6c6c',
    marginBottom: 2,
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
});
