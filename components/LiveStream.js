
import {
    CameraView,
    useCameraPermissions,
  } from "expo-camera";
  import { useRef, useState, useEffect } from "react";
  import { Button, Pressable, StyleSheet, Text, View, Dimensions } from "react-native";
  import { useRouter } from "expo-router";
  import { createLiveStream } from "./livepeerService";
  
  const { width, height } = Dimensions.get("window");
  
  export default function Live() {
    const [permission, requestPermission] = useCameraPermissions();
    const router = useRouter();
    const cameraRef = useRef(null);
    const [isStreaming, setIsStreaming] = useState(false);
    const [streamKey, setStreamKey] = useState(null);
    const [playbackUrl, setPlaybackUrl] = useState(null);
    const [facing, setFacing] = useState("back");
  
    useEffect(() => {
      (async () => {
        await requestPermission();
      })();
    }, []);
  
    if (!permission) return <View style={styles.container} />;
    if (!permission.granted) {
      return (
        <View style={styles.permissionContainer}>
          <Text style={styles.permissionText}>
            We need your permission to use the camera
          </Text>
          <Pressable onPress={requestPermission} style={styles.permissionButton}>
            <Text style={styles.buttonText}>Grant Permission</Text>
          </Pressable>
        </View>
      );
    }
  
    const startLiveStream = async () => {
      console.log("Starting Live Stream...");
      const stream = await createLiveStream();
      if (!stream) {
        console.error("Failed to create Livepeer stream.");
        return;
      }
  
      setStreamKey(stream.streamKey);
      setPlaybackUrl(stream.playbackUrl);
      setIsStreaming(true);
  
      if (cameraRef.current) {
        try {
          await cameraRef.current.startRecording({
            onRecordingFinished: (video) => console.log("Video recorded:", video),
            onRecordingError: (error) => console.error("Recording error:", error),
          });
        } catch (error) {
          console.error("Error starting recording:", error);
        }
      }
    };
  
    const stopLiveStream = () => {
      if (cameraRef.current) {
        cameraRef.current.stopRecording();
      }
      setIsStreaming(false);
      setStreamKey(null);
      setPlaybackUrl(null);
    };
  
    return (
      <View style={styles.container}>
        {isStreaming ? (
          <CameraView
            style={styles.fullScreenCamera}
            ref={cameraRef}
            mode="video"
            facing={facing}
            mute={false}
          />
        ) : (
          <View style={styles.startContainer}>
            <Text style={styles.title}>Live Streaming</Text>
            <Pressable onPress={startLiveStream} style={styles.startButton}>
              <Text style={styles.buttonText}>Start Live Stream</Text>
            </Pressable>
          </View>
        )}
  
        {isStreaming && (
          <View style={styles.controls}>
            <Pressable onPress={stopLiveStream} style={styles.stopButton}>
              <Text style={styles.buttonText}>Stop</Text>
            </Pressable>
            <Pressable
              onPress={() => setFacing(facing === "back" ? "front" : "back")}
              style={styles.flipButton}
            >
              <Text style={styles.buttonText}>Flip</Text>
            </Pressable>
          </View>
        )}
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "black",
      width: '100%'
    },
    fullScreenCamera: {
      width: width,
      height: height,
    },
    controls: {
      position: "absolute",
      bottom: 40,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-evenly",
      alignItems: "center",
    },
    stopButton: {
      backgroundColor: "red",
      padding: 15,
      width: '20%',
      borderRadius: 8,
      alignItems: 'center'
    },
    flipButton: {
      backgroundColor: "blue",
      padding: 15,
      width: '20%',
      borderRadius: 8,
      alignItems: 'center'
    },
    buttonText: {
      color: "white",
      fontSize: 16,
      fontWeight: "bold",
    },
    startContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    title: {
      fontSize: 24,
      color: "white",
      marginBottom: 20,
    },
    startButton: {
      backgroundColor: "green",
      padding: 15,
      borderRadius: 10,
    },
    permissionContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "black",
    },
    permissionText: {
      color: "white",
      textAlign: "center",
      marginBottom: 20,
    },
    permissionButton: {
      backgroundColor: "purple",
      padding: 10,
      borderRadius: 5,
    },
  });
  