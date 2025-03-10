// import { View, FlatList, RefreshControl } from 'react-native';
// import React, { useState, useEffect } from 'react';
// import { collection, getDocs, query } from 'firebase/firestore';
// import { db } from '../../Config/FirebaseConfig';
// import ReelsList from './ReelsList';

// export default function ShortVideo() {
//   const [VideoList, setVideoList] = useState([]);
//   const [refreshing, setRefreshing] = useState(false);

//   useEffect(() => {
//     GetVideoList();
//   }, []);

//   const GetVideoList = async () => {
//     setRefreshing(true);
//     const q = query(collection(db, 'Reels'));
//     const querySnapshot = await getDocs(q);

//     const videos = [];
//     querySnapshot.forEach(doc => {
//       videos.push({
//         id: doc.id,
//         ...doc.data(),
//       });
//     });

//     setVideoList(videos);
//     setRefreshing(false);
//   };

//   return (
//     <View style={{ marginTop: 10 }}>
//       <FlatList
//         data={VideoList}
//         renderItem={({ item }) => (
//           <ReelsList reels={item} />
//         )}
//         keyExtractor={(item) => item.id}
//         refreshControl={
//           <RefreshControl
//             refreshing={refreshing}
//             onRefresh={GetVideoList}
//             colors={['#0891b2']}
//             tintColor="#0891b2"
//           />
//         }
//       />
//     </View>
//   );
// }


import { View, FlatList, RefreshControl } from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../../Config/FirebaseConfig';
import ReelsList from './ReelsList';

export default function ShortVideo() {
  const [VideoList, setVideoList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    GetVideoList();
  }, []);

  const GetVideoList = async () => {
    setRefreshing(true);

    // Fetch videos ordered by createdAt timestamp in descending order
    const q = query(collection(db, 'Reels'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);

    const videos = [];
    querySnapshot.forEach(doc => {
      videos.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    setVideoList(videos);
    setRefreshing(false);
  };

  return (
    <View style={{ marginTop: 10 }}>
      <FlatList
        data={VideoList}
        renderItem={({ item }) => <ReelsList reels={item} />}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={GetVideoList}
            colors={['#0891b2']}
            tintColor="#0891b2"
          />
        }
      />
    </View>
  );
}

