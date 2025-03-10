import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { collection, query, where, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from './../../Config/FirebaseConfig';
import { Video } from 'expo-av';

const PostItem = React.memo(({ item }) => (
  <View style={styles.itemContainer}>
    {item.imageUrl ? (
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.postImage}
      />
    ) : (
      <View style={styles.emptyImage} />
    )}
    <Text style={styles.itemTitle}>{item.Caption || 'No Title'}</Text>
    
  </View>
));

const ReelItem = React.memo(({ item }) => (
  <View style={styles.itemContainer}>
    {item.mediaUrl ? (
      <Video
        style={styles.postImage}
        source={{ uri: item.mediaUrl }}
        useNativeControls
        resizeMode="cover"
      />
    ) : (
      <View style={styles.emptyImage} />
    )}
    <Text style={styles.itemTitle}>{item.Caption || 'No Title'}</Text>
    <Text style={styles.itemContent}>{item.about || 'No Description'}</Text>
  </View>
));

export default function DynamicProfile() {
  const route = useRoute();
  const { userId } = route.params;

  const [activeSection, setActiveSection] = useState('Post');
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [debates, setDebates] = useState([]);
  const [followerCount, setFollowerCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);

  const fetchPosts = useCallback(async () => {
    try {
      const postsQuery = query(collection(db, 'Post'), where('userId', '==', userId));
      const postsSnapshot = await getDocs(postsQuery);
      setPosts(postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [userId]);

  const fetchReels = useCallback(async () => {
    try {
      const reelsQuery = query(collection(db, 'Reels'), where('userId', '==', userId));
      const reelsSnapshot = await getDocs(reelsQuery);
      setReels(reelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching reels:', error);
    }
  }, [userId]);

  const fetchDebates = useCallback(async () => {
    try {
      const debatesQuery = query(collection(db, 'Debate'), where('userId', '==', userId));
      const debatesSnapshot = await getDocs(debatesQuery);
      setDebates(debatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    } catch (error) {
      console.error('Error fetching debates:', error);
    }
  }, [userId]);

  const fetchFollowerCount = useCallback(async () => {
    try {
      const followerDocRef = doc(db, 'FollowerCollection', userId);
      const followerDocSnap = await getDoc(followerDocRef);
      if (followerDocSnap.exists()) {
        setFollowerCount(followerDocSnap.data().FollowerCount);
        setIsFollowing(followerDocSnap.data().isFollowing || false);
      } else {
        // Initialize the document if it doesn't exist
        await setDoc(followerDocRef, {
          FollowerCount: 0,
          isFollowing: false,
        });
      }
    } catch (error) {
      console.error('Error fetching follower count:', error);
    }
  }, [userId]);

  const fetchUserData = useCallback(async () => {
    try {
      const postsQuery = query(collection(db, 'Post'), where('userId', '==', userId));
      const postsSnapshot = await getDocs(postsQuery);

      if (!postsSnapshot.empty) {
        const firstPost = postsSnapshot.docs[0].data();
        setUserData({
          username: firstPost.username,
          userImage: firstPost.userImage,
          email: firstPost.email
        });
      }
    } catch (error) {
      console.error('Error fetching user data from posts:', error);
    }
  }, [userId]);

  const handleFollow = async () => {
    try {
      const followerDocRef = doc(db, 'FollowerCollection', userId);
      await updateDoc(followerDocRef, {
        FollowerCount: isFollowing ? followerCount - 1 : followerCount + 1,
        isFollowing: !isFollowing,
      });
      setFollowerCount(isFollowing ? followerCount - 1 : followerCount + 1);
      setIsFollowing(!isFollowing);
    } catch (error) {
      console.error('Error updating follow status:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchPosts();
      fetchReels();
      fetchDebates();
      fetchFollowerCount();
      fetchUserData();
      setLoading(false);
    }
  }, [userId, fetchPosts, fetchReels, fetchDebates, fetchFollowerCount, fetchUserData]);

  const sections = {
    Post: posts,
    Reels: reels,
    Debate: debates,
  };

  const renderItem = useCallback(({ item }) => {
    if (activeSection === 'Post') return <PostItem item={item} />;
    if (activeSection === 'Reels') return <ReelItem item={item} />;
    return <PostItem item={item} />;
  }, [activeSection]);

  const renderHeader = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      );
    }

    return (
      <>
        <View style={styles.imageContainer}>
          {userData?.userImage ? (
            <Image source={{ uri: userData.userImage }} style={styles.image} />
          ) : (
            <Text>No Image</Text>
          )}
        </View>
        <View style={styles.details}>
          <Text style={styles.name}>{userData?.username || 'Guest User'}</Text>
          <Text style={styles.email}>{userData?.email || 'No Email'}</Text>
          <View style={styles.followerContainer}>
            <Text style={styles.followerCount}>{followerCount}</Text>
            <Text style={styles.followerLabel}>Followers</Text>
            <TouchableOpacity style={styles.followButton} onPress={handleFollow}>
              <Text style={styles.followButtonText}>{isFollowing ? 'Following' : 'Follow'}</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.tabsContainer}>
          {Object.keys(sections).map((section) => (
            <TouchableOpacity
              key={section}
              style={[styles.tab, activeSection === section && styles.activeTab]}
              onPress={() => setActiveSection(section)}
            >
              <Text style={styles.tabText}>{section}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.sectionHeader}>{activeSection}</Text>
      </>
    );
  };

  return loading ? (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  ) : (
    <FlatList
      data={sections[activeSection]}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      contentContainerStyle={styles.scrollContainer}
    />
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  imageContainer: { alignItems: 'center', marginVertical: 25 },
  image: { width: 100, height: 100, borderRadius: 50 },
  details: { alignItems: 'center', marginTop: -15 },
  name: { fontSize: 18, fontWeight: 'bold' },
  email: { fontSize: 14, color: 'gray' },
  followerContainer: { alignItems: 'center', marginTop: 5 },
  followerCount: { fontSize: 24, fontWeight: 'bold', color: 'black' },
  followerLabel: { fontSize: 14, color: 'gray' },
  followButton: { marginTop: 10, padding: 10, backgroundColor: '#007AFF', borderRadius: 5 },
  followButtonText: { color: 'white', fontWeight: 'bold' },
  tabsContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 20 },
  tab: { paddingVertical: 10, paddingHorizontal: 20, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab: { borderBottomColor: 'black' },
  tabText: { fontSize: 16, fontWeight: 'bold' },
  sectionHeader: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  itemContainer: { backgroundColor: '#fff', padding: 15, borderRadius: 5, marginVertical: 5 },
  postImage: { width: '100%', height: 200, resizeMode: 'cover', borderRadius: 5, marginBottom: 10 },
  emptyImage: { width: '100%', height: 200, backgroundColor: '#ddd', borderRadius: 5, marginBottom: 10 },
  itemTitle: { fontSize: 16, fontWeight: 'bold' },
  itemContent: { fontSize: 14, color: 'gray' },
});
