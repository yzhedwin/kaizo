import { Button, Text, View } from "react-native";
import { Drawer } from "./Settings";

export function HomePage({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>Home</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("DetailsScreen")}
      />
    </View>
  );
}

export default function HomeDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Kaizo" component={HomePage} />
      <Drawer.Screen name="Budget Tracker" component={HomePage} />
      <Drawer.Screen name="Packing List" component={HomePage} />
      <Drawer.Screen name="Travel Planner" component={HomePage} />
      <Drawer.Screen name="Find Each Other" component={HomePage} />
    </Drawer.Navigator>
  );
}
