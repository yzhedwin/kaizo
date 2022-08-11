import React from "react";
import { StyleSheet, View, Text } from "react-native";

const Balance = (props) => {
  const { budget, expenses } = props;
  const balance = budget - expenses;

  return (
    <View style={styles.container}>
      <View style={styles.blockContainer}>
        <Text style={{ color: "gray", marginBottom: 10 }}>My Balance</Text>
        <Text style={{ color: "white" }}>
          {props.currency}
          {balance}
        </Text>
      </View>

      <View style={styles.barContainer}></View>

      <View style={styles.blockContainer}>
        <Text style={{ color: "gray", marginBottom: 10 }}>Total Expense</Text>
        <Text style={{ color: "white" }}>
          {props.currency}
          {expenses}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    flexDirection: "row",
    backgroundColor: "black",
  },
  barContainer: {
    width: 1,
    backgroundColor: "white",
  },
  blockContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
});

export default Balance;
