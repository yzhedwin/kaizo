import React from "react";
import { View } from "react-native";
import { makeStyles, Text, Button, useThemeMode } from "@rneui/themed";

export default function Home() {
  const styles = useStyles();
  const { setMode, mode } = useThemeMode();

  const handleOnPress = () => {
    setMode(mode === "dark" ? "light" : "dark");
  };

  return (
    <View style={styles.container}>
      <Text h3>BTO App</Text>
      <Text style={styles.text}>
        Brainhack 2022
      </Text>
      <Button onPress={handleOnPress}>Switch Theme</Button>
    </View>
  );
}

const useStyles = makeStyles((theme) => ({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    marginVertical: theme.spacing.lg,
  },
}));
