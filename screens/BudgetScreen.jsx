import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

/*
Budget tracking
*/

export default function BudgetScreen() {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
    >
      <FocusAwareStatusBar barStyle="dark-content" />
      <View>
        <Text>BudgetScreen</Text>
      </View>
    </SafeAreaView>
  );
}
