import { View, Text, FlatList, RefreshControl, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import Shared from './../../Shared/Shared';
import { useUser } from '@clerk/clerk-expo';
import { collection, query, getDocs, where } from 'firebase/firestore';
import { db } from '../../Config/FirebaseConfig';
import PostList from './../../components/Home/PostList';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Saved() {
  const { user } = useUser();
  const [favIds, setFavIds] = useState([]); // State to store favorite post IDs
  const [favPostList, setFavPostList] = useState([]); // State to store the list of favorite posts
  const [refreshing, setRefreshing] = useState(false); // State to manage the refresh control

  // useEffect hook to fetch favorite post IDs and related posts when the user is available
  useEffect(() => {
    if (user) {
      GetFavPostIds(); // Fetch favorite post IDs if user is logged in
    }
  }, [user]);

  // Fetch favorite post IDs from the Shared utility
  const GetFavPostIds = async () => {
    const result = await Shared.GetFavList(user);
    setFavIds(result?.favorite || []); // Set the favorite post IDs
    GetFavPostList(result?.favorite || []); // Fetch posts related to the favorite IDs
  };

  // Fetch related posts based on favorite post IDs
  const GetFavPostList = async (favIds) => {
    setFavPostList([])
    if (!favIds || favIds.length === 0) return; // Guard clause for empty favorite IDs

    // Create a query to fetch posts where the post ID is in the list of favorite post IDs
    const q = query(collection(db, 'Post'), where('id', 'in', favIds));
    const querySnapshot = await getDocs(q); // Get documents from the query

    let posts = [];
    querySnapshot.forEach((doc) => {
      posts.push(doc.data()); // Add fetched posts to the posts array
    });

    // Sort posts by date (descending order, latest posts first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date)); // Assuming posts have a 'date' field

    setFavPostList(posts); // Set the state with the sorted posts
    setRefreshing(false); // Stop the refreshing animation after data is loaded
  };

  // Handle pull-to-refresh action
  const onRefresh = () => {
    setRefreshing(true); // Set refreshing state to true
    GetFavPostIds(); // Fetch the favorite posts again to refresh the list
  };

  return (

                      // Lighter background for the screen 
    <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}> 
      {/* Header Section */}
      <View style={{
       // flexDirection: 'row',
       // justifyContent: 'space-between',
       // alignItems: 'center',
       // paddingHorizontal: 20, // Increased padding for more space
        // paddingVertical: 15,   // Increased vertical padding for header
        // backgroundColor: 'white',  // White background for the header
        // borderBottomWidth: 1,
        // borderBottomColor: '#ddd'  // Light grey line under the header
      }}>
      
      </View>

      
      <FlatList
           // FlatList to display the list of favorite posts 
        data={favPostList} // Set the data for the FlatList
        keyExtractor={(item) => item.id.toString()} // Use the post ID as the key for each item
        renderItem={({ item }) => (
                     // Add margin for posts 
          <View style={{ marginHorizontal: 15, marginBottom: 15 }}> 
            <PostList post={item} /> {/* Render each post using the PostList component */}
          </View>
        )}
        // Add pull-to-refresh functionality
        refreshControl={
          <RefreshControl
            refreshing={refreshing} // Bind refreshing state
            onRefresh={onRefresh} // Define what happens on refresh
          />
        }
      />
    </View>
  );
}
