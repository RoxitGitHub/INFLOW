import { View, Text, FlatList, RefreshControl } from 'react-native';
import React, { useEffect, useState } from 'react';
import Shared from './../../Shared/Shared';
import { useUser } from '@clerk/clerk-expo';
import { collection, query, onSnapshot, where } from 'firebase/firestore';
import { db } from '../../Config/FirebaseConfig';
import PostList from './../../components/Home/PostList';
import ReelsList from './../../components/Reels/ReelsList';

export default function Saved() {
  const { user } = useUser();
  const [favIds, setFavIds] = useState([]); 
  const [favItems, setFavItems] = useState([]); 
  const [refreshing, setRefreshing] = useState(false); 

  useEffect(() => {
    if (user) {
      GetFavIds();
    }
  }, [user]);

  const GetFavIds = async () => {
    const result = await Shared.GetFavList(user);
    console.log('Fetched Favorite IDs:', result?.favorite || []);

    setFavIds(result?.favorite || []); 
    if (result?.favorite && result.favorite.length > 0) {
      ListenToFavItems(result.favorite);
    } else {
      setFavItems([]); 
    }
  };

  const ListenToFavItems = (favIds) => {
    if (!favIds || favIds.length === 0) return;

    // Firestore real-time listener for posts
    const postQuery = query(collection(db, 'Post'), where('__name__', 'in', favIds.slice(0, 10))); 
    const reelQuery = query(collection(db, 'Reels'), where('__name__', 'in', favIds.slice(0, 10))); 

    const postUnsubscribe = onSnapshot(postQuery, (postSnapshot) => {
      let posts = [];
      postSnapshot.forEach((doc) => {
        posts.push({ id: doc.id, ...doc.data(), type: 'post' });
      });

      const reelUnsubscribe = onSnapshot(reelQuery, (reelSnapshot) => {
        let reels = [];
        reelSnapshot.forEach((doc) => {
          reels.push({ id: doc.id, ...doc.data(), type: 'reel' });
        });

        // Combine posts and reels
        const favItems = [...posts, ...reels];

        // Sort items by createdAt timestamp (latest first)
        favItems.sort((a, b) => 
          (b.createdAt?.toDate?.() || new Date(b.date)) - 
          (a.createdAt?.toDate?.() || new Date(a.date))
        );

        setFavItems(favItems);
      });

      return () => reelUnsubscribe();
    });

    return () => postUnsubscribe();
  };

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true); 
    await GetFavIds();
    setRefreshing(false); 
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#F9F9F9' }}>
      <FlatList
        data={favItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ marginHorizontal: 15, marginBottom: 15 }}>
            {item.type === 'post' ? <PostList post={item} /> : <ReelsList reels={item} />}
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0891b2']}
          />
        }
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', marginTop: 20, fontSize: 16, color: '#656969' }}>
            No saved posts or reels yet.
          </Text>
        }
      />
    </View>
  );
}
