import React, { useState, useEffect } from 'react';
import {
  StyleSheet, TextInput, ActivityIndicator, View, Text, FlatList, Image, TouchableOpacity, 
  Animated, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { Video } from 'expo-av';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './../Config/FirebaseConfig';
import { useRouter } from 'expo-router';

export default function Search() {
  const [isLoading, setIsLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState(null);
  const [allContent, setAllContent] = useState([]);
  const router = useRouter();
  const fadeAnim = useState(new Animated.Value(0))[0];

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const postsCollection = collection(db, 'Post');
        const reelsCollection = collection(db, 'Reels');

        const [postsSnapshot, reelsSnapshot] = await Promise.all([
          getDocs(postsCollection),
          getDocs(reelsCollection)
        ]);

        const posts = postsSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'post',
          ...doc.data()
        }));

        const reels = reelsSnapshot.docs.map(doc => ({
          id: doc.id,
          type: 'reel',
          ...doc.data()
        }));

        setAllContent([...posts, ...reels]);
      } catch (error) {
        console.error("Firebase Error: ", error);
        setError("Error fetching data. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleSearch = (searchTerm) => {
    setSearchQuery(searchTerm);
    if (!searchTerm.trim()) {
      setSearchResults([]);
      return;
    }
    const filteredResults = allContent.filter(content =>
      content.Caption?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  const handleItemClick = (item) => {
    if (item.type === 'post') {
      router.push({
        pathname: '/post-details',
        params: item,
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={styles.container}>
          <Animated.View style={[styles.searchContainer, { opacity: fadeAnim }]}>
            <Ionicons name="search" size={22} color="#888" style={styles.searchIcon} />
            <TextInput
              placeholder="Search for posts or reels..."
              style={styles.searchBox}
              autoCapitalize="none"
              autoCorrect={false}
              value={searchQuery}
              onChangeText={handleSearch}
              onSubmitEditing={() => handleSearch(searchQuery)}
              clearButtonMode="always"
              placeholderTextColor="#888"
              returnKeyType="search"
            />
          </Animated.View>

          {isLoading && (
            <View style={styles.centeredView}>
              <ActivityIndicator size="large" color="#555" />
            </View>
          )}

          {error && (
            <View style={styles.centeredView}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {!isLoading && searchQuery.trim() !== "" && searchResults.length === 0 && (
            <View style={styles.centeredView}>
              <Text style={styles.noResultsText}>No results found</Text>
            </View>
          )}

          {searchQuery.trim() !== "" && (
            <FlatList
              data={searchResults}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TouchableOpacity 
                  onPress={() => handleItemClick(item)} 
                  style={styles.postContainer} 
                  activeOpacity={0.7}
                >
                  <View style={styles.userInfo}>
                    <Image source={{ uri: item.userImage }} style={styles.userImage} />
                    <Text style={styles.username}>{item.username || "Unknown User"}</Text>
                  </View>

                  {item.type === 'post' && item.imageUrl && (
                    <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
                  )}

                  {item.type === 'reel' && item.videoUrl && (
                    <Video
                      source={{ uri: item.videoUrl }}
                      style={styles.video}
                      useNativeControls
                      resizeMode="cover"
                      isLooping
                    />
                  )}

                  <Text style={styles.caption}>{item.Caption}</Text>
                </TouchableOpacity>
              )}
              contentContainerStyle={styles.listContainer}
              showsVerticalScrollIndicator={false}
            />
          )}
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 14,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginVertical: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchBox: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  listContainer: {
    paddingBottom: 70,
  },
  postContainer: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 0.1,
    marginBottom: 15,
    padding: 15,
    // shadowColor: "#000",
    // shadowOffset: { width: 0, height: 3 },
    // shadowOpacity: 0.1,
    // shadowRadius: 6,
    // elevation: 3,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  userImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: '#333',
  },
  postImage: {
    width: '100%',
    height: 250,
    borderRadius: 8,
    marginTop: 8,
  },
  video: {
    width: '100%',
    height: 300,
    borderRadius: 10,
    marginTop: 8,
  },
  caption: {
    fontWeight: "600",
    fontSize: 15,
    color: "#555",
    marginTop: 5,
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
  noResultsText: {
    color: '#888',
    fontSize: 16,
  },
});