import { View, StyleSheet, Text, ScrollView, Touchable, TouchableOpacity } from 'react-native';
import React from 'react';
import Header from '../../components/Home/Header';
import Post from '../../components/Home/Post';
import { Link } from 'expo-router';
import registerNNPushToken from 'native-notify';

registerNNPushToken(28253, 'JrOfhcd94dTTzAkUCuABGw');
export default function Home() {
  return (
    <View style={styles.container}>
      {/* Header 
      <Header />  */}

      {/* Post List */}
      <View style={styles.postContainer}>
        <Post />
      </View>

     


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Make the container take up the full screen
    backgroundColor: '#fff',
  },
  postContainer: {
    flex: 1, // Allow the post list to grow and take up available space
  },

});
