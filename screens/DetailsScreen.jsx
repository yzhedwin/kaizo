import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function DetailsScreen({ navigation }) {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
    >
      <Text>Details!</Text>
      <Button
        title="Go to HomePage"
        onPress={() => navigation.navigate("HomeScreen")}
      />
    </SafeAreaView>
  );
}
