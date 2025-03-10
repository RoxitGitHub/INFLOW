import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs, doc, getDoc } from "firebase/firestore";
import { db } from './../../Config/FirebaseConfig';
import { AVPlaybackStatus, Video } from 'expo-av'; // Use Expo AV for video playback

const PostItem = React.memo(({ item }) => (
  <View style={styles.itemContainer}>
    {item.imageUrl ? (
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.postImage}
        onError={() => console.log('Failed to load post image')}
      />
    ) : (
      <View style={styles.emptyImage} />
    )}
    <Text style={styles.itemTitle}>{item.Caption || 'No Title'}</Text>
    
  </View>
));

const ReelItem = React.memo(({ item }) => {
  const videoRef = React.useRef(null);
  const [status, setStatus] = useState({});

  return (
    <View style={styles.itemContainer}>
      {item.mediaUrl ? (
        <Video
          ref={videoRef}
          style={styles.postImage}
          source={{ uri: item.mediaUrl }}
          useNativeControls
          resizeMode="cover"
          onPlaybackStatusUpdate={status => setStatus(() => status)}
        />
      ) : (
        <View style={styles.emptyImage} />
      )}
      <Text style={styles.itemTitle}>{item.Caption || 'No Title'}</Text>
      
    </View>
  );
});

export default function Profile() {
  const { user } = useUser();
  const [activeSection, setActiveSection] = useState('Post');
  const [posts, setPosts] = useState([]);
  const [reels, setReels] = useState([]);
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [followerCount, setFollowerCount] = useState(0);

  const fetchPosts = useCallback(async () => {
    try {
      const postsQuery = query(collection(db, 'Post'), where('userId', '==', user.id));
      const postsSnapshot = await getDocs(postsQuery);
      const postsData = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched Posts Data:', postsData);
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  }, [user]);

  const fetchReels = useCallback(async () => {
    try {
      const reelsQuery = query(collection(db, 'Reels'), where('userId', '==', user.id));
      const reelsSnapshot = await getDocs(reelsQuery);
      const reelsData = reelsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched Reels Data:', reelsData);
      setReels(reelsData);
    } catch (error) {
      console.error('Error fetching reels:', error);
    }
  }, [user]);

  const fetchDebates = useCallback(async () => {
    try {
      const debatesQuery = query(collection(db, 'Debate'), where('userId', '==', user.id));
      const debatesSnapshot = await getDocs(debatesQuery);
      const debatesData = debatesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      console.log('Fetched Debates Data:', debatesData);
      setDebates(debatesData);
    } catch (error) {
      console.error('Error fetching debates:', error);
    }
  }, [user]);

  const fetchFollowerCount = useCallback(async () => {
    try {
      const followerDocRef = doc(db, 'FollowerCollection', user.id);
      const followerDocSnap = await getDoc(followerDocRef);
      if (followerDocSnap.exists()) {
        setFollowerCount(followerDocSnap.data().FollowerCount);
      }
    } catch (error) {
      console.error('Error fetching follower count:', error);
    }
  }, [user]);

  useEffect(() => {
    if (user && user.id) {
      fetchPosts();
      fetchReels();
      fetchDebates();
      fetchFollowerCount();
      setLoading(false);
    }
  }, [user, fetchPosts, fetchReels, fetchDebates, fetchFollowerCount]);

  const sections = {
    Post: posts,
    Reels: reels,
    Debate: debates,
  };

  const renderItem = useCallback(({ item }) => {
    if (activeSection === 'Post') {
      return <PostItem item={item} />;
    } else if (activeSection === 'Reels') {
      return <ReelItem item={item} />;
    } else {
      return <PostItem item={item} />; // Assuming Debates use the same structure as Posts
    }
  }, [activeSection]);

  const renderEmptySection = () => (
    <View style={styles.emptySection}>
      <Text style={styles.emptySectionText}>No {activeSection.toLowerCase()} available</Text>
    </View>
  );

  const renderHeader = () => (
    <>
      <Link href={'/add-new-post'} style={styles.addNewPost}>
        <Ionicons name="add-circle-outline" size={32} color="black" />
      </Link>

      <View style={styles.imageContainer}>
        {user?.imageUrl ? (
          <Image
            source={{ uri: user.imageUrl }}
            style={styles.image}
          />
        ) : (
          <Text>No Image</Text>
        )}
      </View>

      <View style={styles.details}>
        <Text style={styles.name}>{user?.fullName || 'Guest User'}</Text>
        <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress || 'No Email'}</Text>
        <View style={styles.followerContainer}>
          <Text style={styles.followerCount}>{followerCount}</Text>
          <Text style={styles.followerLabel}>Followers</Text>
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <FlatList
      data={sections[activeSection]}
      keyExtractor={(item) => item.id}
      renderItem={renderItem}
      ListHeaderComponent={renderHeader}
      ListEmptyComponent={renderEmptySection}
      contentContainerStyle={styles.scrollContainer}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'whitesmoke'
  },
  scrollContainer: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addNewPost: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    marginVertical: 25,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  details: {
    alignItems: 'center',
    marginTop: -15,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  email: {
    fontSize: 14,
    color: 'gray',
  },
  followerContainer: {
    alignItems: 'center',
    marginTop: 5,
  },
  followerCount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'black',
  },
  followerLabel: {
    fontSize: 14,
    color: 'gray',
  },
  tabsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: 'black',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 5,
    marginVertical: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  postImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
    borderRadius: 5,
    marginBottom: 10,
  },
  emptyImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemContent: {
    fontSize: 14,
    color: 'gray',
  },
  emptySection: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emptySectionText: {
    fontSize: 16,
    color: 'gray',
  },
});
