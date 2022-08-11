import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/FontAwesome5";
import BudgetTabs from "../../components/tabs/BudgetTabs";
import { Colors, Typography } from "../../utils/Styles";

const TransactionScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
      <Text style={[Typography.H1, {color: Colors.WHITE, marginBottom: 10}]}>Transactions</Text>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate("AddExpense")}
          style={styles.iconContainer}
        >
          <Ionicons name="add-circle-outline" color={Colors.WHITE} size={40} />
        </TouchableOpacity>
      </View>

      {/* Body */}
      <View style={{ flex: 1 }}>
        <BudgetTabs />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  // Header
  headerContainer: {
    padding: 10,
    paddingBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "dark-gray",
  },
});

export default TransactionScreen;
