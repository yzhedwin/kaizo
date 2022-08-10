import React from "react";
import { Button, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

/*
# Job Applications #
Allow input of Jobs Applied | Job Role | Status | Salary
Autofill company names 
click + > key in data > submit
*/

export default function JobApp({ navigation }) {
  const [company, setCompany] = React.useState();
  const [role, setRole] = React.useState();
  const [status, setStatus] = React.useState();
  const [salary, setSalary] = React.useState();
  const [count, setCount] = React.useState(0);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button onPress={() => setCount((c) => c + 1)} title="Update count" />
      ),
    });
  }, [navigation]);

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
    >
      <FocusAwareStatusBar barStyle="dark-content" />
      <View>
        <TextInput placeholder="Input Company"></TextInput>
        <Text>This is the Job App Status Page</Text>
        <Text>Count: {count}</Text>
      </View>
    </SafeAreaView>
  );
}
