import React, { useEffect, useState } from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Tabs } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Ionicons from '@expo/vector-icons/Ionicons';
import TabBar from '../../components/TabBar';
import Debate from './../Debate';
import Live from './../Live';
import * as Linking from 'expo-linking';
import Search from './../Search';
import Notification from './../Notification';
import customDrawerContent from './../../components/customDrawerContent';
import Profile from './Profile';
import DynamicProfile from './../../components/PostDetails/DynamicProfile'; // Import DynamicProfile
import { View, StyleSheet, Text, BackHandler } from 'react-native';
import { getUnreadNotificationInboxCount } from 'native-notify';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Custom Tabs Component
function TabLayout() {
  const navigation = useNavigation();
  const [unreadNotificationCount, setUnreadNotificationCount] = useState(0);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const unreadCount = await getUnreadNotificationInboxCount(28253, 'JrOfhcd94dTTzAkUCuABGw');
        console.log("unreadCount: ", unreadCount);
        setUnreadNotificationCount(unreadCount);
      } catch (error) {
        console.error("Error fetching unread notification count:", error);
      }
    };

    fetchUnreadCount(); // Initial fetch

    const intervalId = setInterval(fetchUnreadCount, 10000); // Fetch every 10 seconds

    return () => clearInterval(intervalId); // Cleanup interval on unmount
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        if (navigation.isFocused() && navigation.canGoBack()) {
          BackHandler.exitApp(); // Exit the app
          return true;
        }
        return false;
      };

      const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);

      return () => subscription.remove();
    }, [navigation])
  );

  return (
    <Tabs tabBar={(props) => <TabBar {...props} />}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'inflow',
          headerShown: true,
          headerTitleStyle: { color: '#007AFF', fontSize: 24, fontWeight: 'bold' },
          headerLeft: () => (
            <Ionicons
              name="menu"
              size={26}
              color="black"
              style={{ marginLeft: 10 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
          headerRight: () => (
            <View style={styles.headerRight}>
              <View style={{ position: 'relative' }}>
                <Ionicons
                  name="notifications-outline"
                  size={24}
                  color="black"
                  style={{ marginRight: 10 }}
                  onPress={() => navigation.navigate('Notification')}
                />
                {unreadNotificationCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>{unreadNotificationCount}</Text>
                  </View>
                )}
              </View>
              <Ionicons
                name="search"
                size={24}
                color="black"
                style={{ marginRight: 13 }}
                onPress={() => navigation.navigate('Search')}
              />
            </View>
          ),
        }}
      />

      {/* Reels */}
      <Tabs.Screen
        name="Reels"
        options={{
          title: 'Reels',
          headerShown: true,
          headerLeft: () => (
            <Ionicons
              name="menu"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      />

      {/* Saved */}
      <Tabs.Screen
        name="Saved"
        options={{
          title: 'Saved',
          headerShown: true,
          headerLeft: () => (
            <Ionicons
              name="menu"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      />

      {/* Profile */}
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profile',
          headerShown: true,
          headerLeft: () => (
            <Ionicons
              name="menu"
              size={24}
              color="black"
              style={{ marginLeft: 10 }}
              onPress={() => navigation.openDrawer()}
            />
          ),
        }}
      />
    </Tabs>
  );
}

// Main Drawer Layout
export default function MainLayout() {
  const navigation = useNavigation();

  useEffect(() => {
    const handleDeepLink = (event) => {
      const url = Linking.parse(event.url);
      if (url.path === 'home') {
        navigation.navigate('Home', { screen: 'home' });
      } else if (url.path === 'notification') {
        navigation.navigate('Notification');
      } else if (url.path === 'search') {
        navigation.navigate('Search');
      } else if (url.path === 'debate') {
        navigation.navigate('Debate');
      } else if (url.path === 'live') {
        navigation.navigate('Live');
      }
    };

    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink({ url });
      }
    });

    const subscription = Linking.addEventListener('url', handleDeepLink);

    return () => {
      subscription.remove(); // Use the remove method to unsubscribe
    };
  }, [navigation]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer.Navigator
        drawerContent={customDrawerContent}
        screenOptions={{
          drawerStyle: {
            backgroundColor: '#f8f9fa',
            width: 250,
          },
          drawerActiveTintColor: '#47c7f5',
          drawerInactiveTintColor: '#333',
          drawerLabelStyle: {
            fontSize: 16,
          },
        }}
      >
        <Drawer.Screen
          name="Home"
          component={TabLayout}
          options={{
            drawerLabel: 'Home',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
            headerShown: false,
          }}
        />

        {/* Drawer Screen for Debate */}
        <Drawer.Screen
          name="Debate"
          component={Debate}
          options={{
            drawerLabel: 'Debate',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="videocam" size={size} color={color} />
            ),
            headerShown: true,
          }}
        />

        {/* Drawer Screen for Live */}
        <Drawer.Screen
          name="Live"
          component={Live}
          options={{
            drawerLabel: 'Live',
            drawerIcon: ({ size, color }) => (
              <Ionicons name="radio" size={24} color="black" />
            ),
            headerShown: true,
          }}
        />

        {/* Drawer Screen for DynamicProfile */}
        <Drawer.Screen
          name="DynamicProfile"
          component={DynamicProfile}
          options={{
            drawerLabel: () => null, // Hide from drawer
            drawerItemStyle: { height: 0 }, // Hide from drawer
            headerShown:false
          }}
        />
      </Drawer.Navigator>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: 1,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 12,
  },
});


// import React, { useEffect } from 'react';
// import { createDrawerNavigator } from '@react-navigation/drawer';
// import { createStackNavigator } from '@react-navigation/stack';
// import { Tabs } from 'expo-router';
// import { GestureHandlerRootView } from 'react-native-gesture-handler';
// import { useNavigation, useFocusEffect, useIsFocused } from '@react-navigation/native';
// import Ionicons from '@expo/vector-icons/Ionicons';
// import TabBar from '../../components/TabBar';
// import Debate from './../Debate';
// import Live from './../Live';
// import * as Linking from 'expo-linking';
// import Search from './../Search';
// import Notification from './../Notification';
// import customDrawerContent from './../../components/customDrawerContent';
// import Profile from './Profile';
// import { View, StyleSheet, BackHandler, Alert } from 'react-native';

// const Drawer = createDrawerNavigator();
// const Stack = createStackNavigator();

// // Custom Tabs Component
// function TabLayout() {
//   const navigation = useNavigation();
//   const route = useNavigation().getState().routes[useNavigation().getState().index];

//   useFocusEffect(
//     React.useCallback(() => {
//       const onBackPress = () => {
//         if (route.name === 'home') {
//           Alert.alert(
//             "Exit App",
//             "Do you want to exit?",
//             [
//               {
//                 text: "Cancel",
//                 onPress: () => null,
//                 style: "cancel"
//               },
//               { text: "YES", onPress: () => BackHandler.exitApp() }
//             ]
//           );
//           return true;
//         }
//         return false;
//       };

//       BackHandler.addEventListener('hardwareBackPress', onBackPress);

//       return () =>
//         BackHandler.removeEventListener('hardwareBackPress', onBackPress);
//     }, [route])
//   );

//   return (
//     <Tabs tabBar={(props) => <TabBar {...props} />}>
//       <Tabs.Screen
//         name="home"
//         options={{
//           title: 'inflow',
//           headerShown: true,
//           headerTitleStyle: { color: '#007AFF', fontSize:24,fontWeight:'bold' },
//           headerLeft: () => (
//             <Ionicons
//               name="menu"
//               size={26}
//               color="black"
//               style={{ marginLeft: 10 }}
//               onPress={() => navigation.openDrawer()}
//             />
//           ),
//           headerRight: () => (
//             <View style={styles.headerRight}>
//               <Ionicons
//                 name="notifications-outline"
//                 size={24}
//                 color="black"
//                 style={{ marginRight: 10 }}
//                 onPress={() => navigation.navigate('Notification')}
//               />
//               <Ionicons
//                 name="search"
//                 size={24}
//                 color="black"
//                 style={{ marginRight: 13 }}
//                 onPress={() => navigation.navigate('Search')}
//               />
//             </View>
//           ),
//         }}
//       />

//       {/* Reels */}
//       <Tabs.Screen
//         name="Reels"
//         options={{
//           title: 'Reels',
//           headerShown: true,
//           headerLeft: () => (
//             <Ionicons
//               name="menu"
//               size={24}
//               color="black"
//               style={{ marginLeft: 10 }}
//               onPress={() => navigation.openDrawer()}
//             />
//           ),
//         }}
//       />

//       {/* Saved */}
//       <Tabs.Screen
//         name="Saved"
//         options={{
//           title: 'Saved',
//           headerShown: true,
//           headerLeft: () => (
//             <Ionicons
//               name="menu"
//               size={24}
//               color="black"
//               style={{ marginLeft: 10 }}
//               onPress={() => navigation.openDrawer()}
//             />
//           ),
//         }}
//       />

//       {/* Profile */}
//       <Tabs.Screen
//         name="Profile"
//         options={{
//           title: 'Profile',
//           headerShown: true,
//           headerLeft: () => (
//             <Ionicons
//               name="menu"
//               size={24}
//               color="black"
//               style={{ marginLeft: 10 }}
//               onPress={() => navigation.openDrawer()}
//             />
//           ),
//         }}
//       />
//     </Tabs>
//   );
// }

// // Main Drawer Layout
// export default function MainLayout() {
//   const navigation = useNavigation();

//   useEffect(() => {
//     const handleDeepLink = (event) => {
//       const url = Linking.parse(event.url);
//       if (url.path === 'home') {
//         navigation.navigate('Home', { screen: 'home' });
//       } else if (url.path === 'notification') {
//         navigation.navigate('Notification');
//       } else if (url.path === 'search') {
//         navigation.navigate('Search');
//       } else if (url.path === 'debate') {
//         navigation.navigate('Debate');
//       } else if (url.path === 'live') {
//         navigation.navigate('Live');
//       }
//     };

//     Linking.getInitialURL().then((url) => {
//       if (url) {
//         handleDeepLink({ url });
//       }
//     });

//     Linking.addEventListener('url', handleDeepLink);
//   }, []);

//   return (
//     <GestureHandlerRootView style={{ flex: 1 }}>
//       <Drawer.Navigator
//         drawerContent={customDrawerContent}
//         screenOptions={{
//           drawerStyle: {
//             backgroundColor: '#f8f9fa',
//             width: 250,
//           },
//           drawerActiveTintColor: '#47c7f5',
//           drawerInactiveTintColor: '#333',
//           drawerLabelStyle: {
//             fontSize: 16,
//           },
//         }}
//       >
//         <Drawer.Screen
//           name="Home"
//           component={TabLayout}
//           options={{
//             drawerLabel: 'Home',
//             drawerIcon: ({ size, color }) => (
//               <Ionicons name="home" size={size} color={color} />
//             ),
//             headerShown: false,
//           }}
//         />

//         {/* Drawer Screen for Debate */}
//         <Drawer.Screen
//           name="Debate"
//           component={Debate}
//           options={{
//             drawerLabel: 'Debate',
//             drawerIcon: ({ size, color }) => (
//               <Ionicons name="videocam" size={size} color={color} />
//             ),
//             headerShown: true,
//           }}
//         />

//         {/* Drawer Screen for Live */}
//         <Drawer.Screen
//           name="Live"
//           component={Live}
//           options={{
//             drawerLabel: 'Live',
//             drawerIcon: ({ size, color }) => (
//               <Ionicons name="radio" size={24} color="black" />
//             ),
//             headerShown: true,
//           }}
//         />
//       </Drawer.Navigator>
//     </GestureHandlerRootView>
//   );
// }

// const styles = StyleSheet.create({
//   headerRight: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
// });
