// import React from 'react';
// import { View, Text, Pressable, Image, StyleSheet, Alert, BackHandler } from 'react-native';
// import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
// import { useSafeAreaInsets } from 'react-native-safe-area-context';
// import { useAuth, useUser } from '@clerk/clerk-expo';
// import { useRouter } from 'expo-router';
// import Ionicons from '@expo/vector-icons/Ionicons';

// export default function CustomDrawerContent(props) {
//   const { user } = useUser();
//   const { signOut } = useAuth();
//   const router = useRouter();
//   const { bottom } = useSafeAreaInsets();

//   const handleLogout = async () => {
//     try {
//       await signOut();
//       router.replace('/login');
//     } catch (error) {
//       console.error('Error signing out:', error);
//       Alert.alert('Error', 'Failed to sign out. Please try again.');
//     }
//   };

//   React.useEffect(() => {
//     const handleBackPress = () => {
//       if (router.pathname === '/login') {
//         Alert.alert(
//           'Exit App',
//           'Do you want to exit the app?',
//           [
//             { text: 'Cancel', onPress: () => null, style: 'cancel' },
//             { text: 'YES', onPress: () => BackHandler.exitApp() },
//           ],
//           { cancelable: false }
//         );
//         return true;
//       }
//       return false;
//     };

//     const subscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress);

//     return () => {
//       subscription.remove();
//     };
//   }, [router.pathname]);

//   return (
//     <View style={styles.container}>
//       <DrawerContentScrollView {...props}>
//         <View style={styles.header}>
//           <Image
//             style={styles.logo}
//             resizeMode='contain'
//             source={require('./../assets/images/logo.png')}
//           />
//           <Text style={styles.username}>{user?.fullName || 'User'}</Text>
//         </View>
//         <DrawerItemList {...props} />
//       </DrawerContentScrollView>
//       <Pressable
//         style={[styles.logoutButton, { marginBottom: bottom + 10 }]}
//         onPress={handleLogout}
//       >
//         <View style={styles.logoutIconContainer}>
//           <Ionicons name="log-out-outline" size={24} color="black" />
//           <Text style={styles.logoutText}>Logout</Text>
//         </View>
//       </Pressable>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   header: {
//     padding: 20,
//     alignItems: 'center',
//     borderBottomWidth: 1,
//     borderBottomColor: '#e0e0e0',
//   },
//   logo: {
//     height: 50,
//     width: 50,
//     marginBottom: 10,
//   },
//   username: {
//     fontSize: 16,
//     fontWeight: '600',
//     color: '#333',
//   },
//   logoutButton: {
//     padding: 20,
//     flexDirection: 'row',
//     alignItems: 'center',
//     borderTopWidth: 1,
//     borderTopColor: '#e0e0e0',
//   },
//   logoutIconContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//   },
//   logoutText: {
//     marginLeft: 10,
//     fontSize: 16,
//     fontWeight: '500',
//     color: 'black',
//   },
// });


// ===============
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Pressable, 
  Image, 
  StyleSheet, 
  Modal, 
  BackHandler, 
  Platform 
} from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function CustomDrawerContent(props) {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const { bottom } = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  const handleLogout = () => {
    setModalVisible(true);
  };

  const confirmLogout = async () => {
    setModalVisible(false);
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Error signing out:', error);
      setModalVisible(true); // Show modal again in case of failure
    }
  };

  React.useEffect(() => {
    const handleBackPress = () => {
      if (router.pathname === '/login') {
        setModalVisible(true);
        return true;
      }
      return false;
    };

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, [router.pathname]);

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.header}>
          <Image
            style={styles.logo}
            resizeMode='contain'
            source={require('./../assets/images/logo.png')}
          />
          <Text style={styles.username}>{user?.fullName || 'User'}</Text>
        </View>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <Pressable
        style={[styles.logoutButton, { marginBottom: Platform.select({ ios: bottom + 10, android: bottom }) }]}
        onPress={handleLogout}
      >
        <View style={styles.logoutIconContainer}>
          <Ionicons name="log-out-outline" size={24} color="black" />
          <Text style={styles.logoutText}>Logout</Text>
        </View>
      </Pressable>

      {/* Logout Confirmation Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalButton, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                <Text style={styles.modalButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={[styles.modalButton, styles.confirmButton]} onPress={confirmLogout}>
                <Text style={styles.modalButtonText}>Yes</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  logo: {
    height: 50,
    width: 50,
    marginBottom: 10,
  },
  username: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  logoutButton: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  logoutIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontWeight: '500',
    color: 'black',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  modalButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  cancelButton: {
    backgroundColor: '#ddd',
  },
  confirmButton: {
    backgroundColor: '#ff4d4d',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: 'white',
  },
});


