// import { View, FlatList, RefreshControl } from 'react-native';
// import React, { useEffect, useState } from 'react';
// import { collection, getDocs, query, orderBy } from 'firebase/firestore';
// import PostList from './PostList';
// import { db } from '../../Config/FirebaseConfig';

// export default function Post() {
//   const [postList, setPost] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     GetPostList();
//   }, []);

//   const GetPostList = async () => {
//     setRefreshing(true); // Start refreshing indicator

//     // Fetch posts ordered by Date in descending order (newest first)
//     const q = query(collection(db, 'Post'), orderBy('Date', 'desc'));
//     const querySnapshot = await getDocs(q);

//     const posts = [];
//     querySnapshot.forEach(doc => {
//       posts.push({
//         id: doc.id,
//         ...doc.data(),
//       });
//     });

//     setPost(posts); // Update the state with sorted posts
//     setRefreshing(false); // Stop refreshing indicator
//   };

//   return (
//     <View style={{ flex: 1 }}> 
//       <FlatList
//         data={postList}
//         renderItem={({ item }) => <PostList post={item} />}
//         keyExtractor={(item) => item.id} // Use unique Firestore ID as key
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={GetPostList} // Trigger refresh when pulled
//             colors={['#0891b2']} // Refresh spinner color for Android
//             tintColor="#0891b2" // Refresh spinner color for iOS
//           />
//         }
//       />
//     </View>   
//   );
// } 


import { View, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import PostList from './PostList';
import { db } from '../../Config/FirebaseConfig';

export default function Post() {
  const [postList, setPost] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    GetPostList();
  }, []);

  const GetPostList = async () => {
    setRefreshing(true); // Start refreshing indicator

    // Fetch posts ordered by createdAt timestamp in descending order (newest first)
    const q = query(collection(db, 'Post'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const posts = [];
    querySnapshot.forEach(doc => {
      posts.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setPost(posts); // Update the state with sorted posts
    setRefreshing(false); // Stop refreshing indicator
  };

  return (
    <View style={{ flex: 1 }}> 
      <FlatList
        data={postList}
        renderItem={({ item }) => <PostList post={item} />}
        keyExtractor={(item) => item.id} // Use unique Firestore ID as key
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={GetPostList} // Trigger refresh when pulled
            colors={['#0891b2']} // Refresh spinner color for Android
            tintColor="#0891b2" // Refresh spinner color for iOS
          />
        }
      />
    </View>   
  );
}
