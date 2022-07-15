import React from 'react'
import { Text } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

/* Display Itinery */

export default function TravelScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
    >
      <Text>Travel Planner</Text>
    </SafeAreaView>
  )
}
