import React from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { Colors, Typography } from "../utils/Styles";



const BudgetButton = (props) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      style={styles.container}
      onPress={props.onPress}
    >
      <Text style={[Typography.H3, { color: Colors.WHITE }]}>
        {props.title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    backgroundColor: Colors.LIGHT_BLACK,
  },
});

export default BudgetButton;
