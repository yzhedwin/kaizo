import React from "react";
import { StyleSheet, View, Text } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import CircularProgress from "../CircularProgress";

const PieChart = (props) => {
  const incomes = props.incomes;
  const expenses = props.expenses;

  const expensesPercent =
    incomes == 0 && expenses == 0
      ? 0
      : incomes == 0
      ? 0
      : ((expenses / incomes) * 100).toFixed(2);
  const currentPercent =
    incomes == 0 && expenses == 0 ? 0 : (100 - expensesPercent).toFixed(2);

  return (
    <View style={styles.container}>
      <View style={styles.pieContainer}>
        <CircularProgress percent={currentPercent} />
      </View>
      <View style={styles.numbersContainer}>
        <View style={styles.rowContainer}>
          <Icon name="circle" size={15} color={"black"} />
          <Text style={{ marginLeft: 5, color: "black" }}>
            Spent ({expensesPercent}%)
          </Text>
        </View>
        <View style={styles.rowContainer}>
          <Icon name="circle" size={15} color={"white"} />
          <Text style={{ marginLeft: 5, color: "white" }}>
            Current ({currentPercent}%)
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    borderRadius: 16,
    flexDirection: "row",
    backgroundColor: "green",
  },
  pieContainer: {
    padding: 15,
  },
  numbersContainer: {
    flex: 1,
    padding: 10,
    paddingLeft: 0,
    justifyContent: "center",
  },
  rowContainer: {
    marginTop: 5,
    marginBottom: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});

export default PieChart;
