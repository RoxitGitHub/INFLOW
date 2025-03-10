import { View, FlatList, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { db } from '../../Config/FirebaseConfig';
import { collection, query, onSnapshot } from 'firebase/firestore';
import DebateList from './DebateList';

export default function DebateVideo() {
  const [videoList, setVideoList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const q = query(collection(db, 'Debate'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const videos = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      console.log('Fetched Debates:', videos); // Debugging output
      setVideoList(videos);
    });
  
    return () => unsubscribe();
  }, []);
  

  // Pull-to-refresh handler
  const onRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false); // Data updates in real-time, no need to fetch manually
  };

  return (
    <View>
      <FlatList
        data={videoList}
        renderItem={({ item }) => <DebateList debate={item} />}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#0891b2']}
            tintColor="#0891b2"
          />
        }
      />
    </View>
  );
}
