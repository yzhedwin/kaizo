import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FocusAwareStatusBar } from "../components/statusbar/FocusAwareStatusBar";

/* Packing List
Lets user input packing list

Loads number of lists from firestore and render as clickable image
List item can be checked off/deleted/added

*/
export default function PListScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
    >
      <FocusAwareStatusBar barStyle="dark-content" />
      <View>
        <Text>Packing List Screen</Text>
      </View>
    </SafeAreaView>
  );
}
