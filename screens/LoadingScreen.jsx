import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function LoadingScreen() {
  return (
    <SafeAreaView
    style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
  >
    <Text>Loading</Text>
  </SafeAreaView>
  )
}
