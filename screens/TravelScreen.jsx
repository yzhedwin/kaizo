import React from "react";
import { Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

/* Display Itinery
Let user input travel iternary for a specified duration
*Includes hotel + flights details
Let user update travel plan
Let user visualise plan for the day
Remind user to bring necessary stuff during the day
Map to destination

*/

export default function TravelScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
    >
      <FocusAwareStatusBar barStyle="dark-content" />
      <Text>Travel Planner</Text>
    </SafeAreaView>
  );
}
