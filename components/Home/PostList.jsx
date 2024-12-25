import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import React from 'react';
import { useRouter } from 'expo-router';

export default function PostList({ post }) {
  const router = useRouter();

  return (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: '/post-details',
          params: post,
        })
      }
      style={styles.postContainer}
    >
      {/* Post Image */}
      <Image source={{ uri: post?.imageUrl }} style={styles.postImage} />

      {/* Caption (Title) */}
      <Text style={styles.caption}>{post?.Caption}</Text>

      {/* User Name (Optional) */}
      <Text style={styles.userName}>{post?.userName}</Text>

      {/* Date and Time */}
      <Text style={styles.date}>{post?.Date}</Text>
    </TouchableOpacity>
  );
}

// Sorting the posts by timestamp when displaying them (usually in the parent component)
export const sortPostsByTimestamp = (posts) => {
  return posts.sort((a, b) => b?.timestamp?.seconds - a?.timestamp?.seconds); // b to show latest first
};

const styles = StyleSheet.create({
  postContainer: {
    backgroundColor: '#fff', // White background for posts
    borderBottomWidth: 1, // Border line separating each post (similar to Reddit)
    borderColor: '#ddd', // Light gray border color
    paddingVertical: 10, // Padding for vertical spacing
    paddingHorizontal: 16, // Horizontal padding for left and right
    marginBottom: 15, // Space between posts
  },
  postImage: {
    width: '100%', // Image will take up full width
    height: 250, // Image height
    resizeMode: 'cover', // Ensure proper aspect ratio while covering the area
    borderRadius: 5, // Rounded corners for the image
  },
  caption: {
    fontSize: 16, // Standard font size for captions
    fontFamily: 'outfit-bold', // Bold font for emphasis
    marginTop: 10, // Space between the image and caption
    color: '#333', // Dark color for readability
  },
  userName: {
    fontSize: 14, // Smaller size for the username
    fontFamily: 'outfit-medium', // Regular font for user names
    color: '#007BFF', // Blue color for clickable username
    marginTop: 5, // Space between the caption and the username
  },
  date: {
    fontSize: 12, // Smaller font size for the date
    fontFamily: 'outfit-medium', // Medium weight for date
    color: '#777', // Light gray color for the date
    marginTop: 5, // Space between the username and date
  },
});
