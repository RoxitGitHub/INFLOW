import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import LiveStream from "./../components/LiveStream"

export default function Live() {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    {/* <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 20 }}>Live Stream Page</Text> */}
    <LiveStream />
  </SafeAreaView>
  )
}