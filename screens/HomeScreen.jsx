import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DetailsScreen from "./DetailsScreen";
import { Drawer, SettingsScreen } from "./SettingsScreen";

const HomeStack = createNativeStackNavigator();

function HomeScreenStack() {
  return (
      <HomeStack.Navigator
        screenOptions={{ headerShown: false }}
        initialRouteName="Kaizo"
      >
        <HomeStack.Screen name="HomeScreen" component={HomeScreen} />
        <HomeStack.Screen name="DetailsScreen" component={DetailsScreen} />
        {/* other screens */}
      </HomeStack.Navigator>
  );
}

export function HomeScreen({ navigation }) {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
    >
      <Text>Home Screen</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate("DetailsScreen")}
      />
    </SafeAreaView>
  );
}

export default function HomeDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Kaizo" component={HomeScreenStack} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
