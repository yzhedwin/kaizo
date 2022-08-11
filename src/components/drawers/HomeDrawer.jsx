import { Ionicons } from "@expo/vector-icons";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Button, Image } from "react-native";
import HomeScreen from "../../screens/HomeScreen";
import JobApp from "../../screens/JobApp";
import SettingsScreen from "../../screens/SettingsScreen";
import { getHeaderTitle } from "@react-navigation/elements";

const Drawer = createDrawerNavigator();

function LogoTitle(props) {
  console.log(props)
  return <Ionicons name="beer-outline" size={20}></Ionicons>;
}

export default function HomeDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Kaizo" component={HomeScreen} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
      {/* <Drawer.Screen
        name="Jobs"
        component={JobApp}
      /> */}
    </Drawer.Navigator>
  );
}
