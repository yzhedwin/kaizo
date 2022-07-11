import { createDrawerNavigator } from "@react-navigation/drawer";
import { Button, Text, View } from "react-native";

export const Drawer = createDrawerNavigator();

export function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Settings</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("DetailsScreen")}
      />
    </View>
  );
}
