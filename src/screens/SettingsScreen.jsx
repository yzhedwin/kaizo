import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SettingsScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("DetailsScreen")}
      />
    </SafeAreaView>
  );
}
