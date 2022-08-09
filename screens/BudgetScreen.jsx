import React from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

/*
Budget tracking
Allow user to input expenses easily and set budget.
Allow user to see current budget and projected expenses
Allow user to see daily/weekly expenses
Categorised expenditure 
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
