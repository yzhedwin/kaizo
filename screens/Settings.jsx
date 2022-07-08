import { createDrawerNavigator } from "@react-navigation/drawer";
import { Button, Text, View } from "react-native";
import { HomePage } from "./HomeStack";

export const Drawer = createDrawerNavigator();

function SettingsScreen({ navigation }) {
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

export default function SettingsDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Kaizo" component={SettingsScreen} />
      <Drawer.Screen name="Budget Tracker" component={HomePage} />
      <Drawer.Screen name="Packing List" component={HomePage} />
      <Drawer.Screen name="Travel Planner" component={HomePage} />
      <Drawer.Screen name="Find Each Other" component={HomePage} />
    </Drawer.Navigator>
  );
}
