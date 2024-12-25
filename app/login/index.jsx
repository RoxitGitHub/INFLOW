import { ImageBackground, Text, View, Pressable } from "react-native";
import React from "react";
import Colors from "../../constants/Colors";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import * as Linking from "expo-linking";
import { useCallback } from "react";

export const useWarmUpBrowser = () => {
  React.useEffect(() => {
    // Warm up the android browser to improve UX
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  useWarmUpBrowser();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL("/(tabs)/home", { scheme: "myapp" }),
      });

      if (createdSessionId) {
        // Uncomment this line to set active session:
        // await setActive({ sessionId: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.White,
      }}
    >
      {/* Background Image */}
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1495020689067-958852a7765e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmV3c3xlbnwwfHwwfHx8MA%3D%3D",
        }}
        style={{
          flex: 1,
          resizeMode: "cover",
        }}
      >
        {/* Overlay for better text readability */}
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.4)", // Semi-transparent overlay
            justifyContent: "center",
            paddingHorizontal: 20,
          }}
        >
          {/* App Title and Subtitle */}
          <View
            style={{
              alignItems: "center",
              marginBottom: 50,
            }}
          >
            <Text
              style={{
                fontFamily: "outfit-bold",
                fontSize: 36,
                textAlign: "center",
                color: Colors.White,
                textShadowColor: "rgba(0,0,0,0.8)",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 4,
                marginBottom: 10,
              }}
            >
              Inflow
            </Text>
            <Text
              style={{
                fontFamily: "outfit",
                fontSize: 16,
                textAlign: "center",
                color: Colors.White,
                opacity: 0.9,
                lineHeight: 24,
              }}
            >
              Discover knowledge, explore ideas, and grow every day.
            </Text>
          </View>

          {/* Get Started Button */}
          <View
            style={{
              justifyContent: "flex-end",
              paddingHorizontal: 20,
            }}
          >
            <Pressable
              onPress={onPress}
              style={{
                padding: 16,
                backgroundColor: Colors.Blue,
                borderRadius: 14,
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
                elevation: 6,
              }}
            >
              <Text
                style={{
                  fontFamily: "outfit-medium",
                  fontSize: 18,
                  color: Colors.White,
                  textTransform: "uppercase",
                }}
              >
                Get Started
              </Text>
            </Pressable>
          </View>

          {/* Terms Section */}
          <Text
            style={{
              fontFamily: "outfit",
              fontSize: 14,
              color: Colors.White,
              textAlign: "center",
              marginTop: 20,
              opacity: 0.8,
            }}
          >
            By proceeding, you agree to our{" "}
            <Text style={{ textDecorationLine: "underline" }}>Terms</Text> and{" "}
            <Text style={{ textDecorationLine: "underline" }}>Privacy Policy</Text>.
          </Text>
        </View>
      </ImageBackground>
    </View>
  );
}
