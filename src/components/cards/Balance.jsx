import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Colors, Typography } from "../../utils/Styles";

const Balance = (props) => {
  const { budget, expenses } = props;
  const balance = budget - expenses;

  return (
    <View style={styles.container}>
      <View style={styles.blockContainer}>
        <Text
          style={[
            Typography.TAGLINE,
            { color: Colors.GRAY_THIN, marginBottom: 10 },
          ]}
        >
          My Balance
        </Text>
        <Text style={[Typography.H1, { color: Colors.WHITE }]}>
          {props.currency}
          {balance}
        </Text>
      </View>

      <View style={styles.barContainer}></View>

      <View style={styles.blockContainer}>
        <Text
          style={[
            Typography.TAGLINE,
            { color: Colors.GRAY_THIN, marginBottom: 10 },
          ]}
        >
          Total Expense
        </Text>
        <Text style={[Typography.H1, { color: Colors.WHITE }]}>
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
    backgroundColor: Colors.BLACK,
  },
  barContainer: {
    width: 1,
    backgroundColor: Colors.WHITE,
  },
  blockContainer: {
    flex: 1,
    padding: 20,
    paddingTop: 30,
    paddingBottom: 30,
  },
});

export default Balance;
