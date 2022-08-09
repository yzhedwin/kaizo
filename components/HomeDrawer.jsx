import { createDrawerNavigator } from "@react-navigation/drawer";
import HomeScreenStack from "../screens/HomeScreen";
import SettingsScreen from "../screens/SettingsScreen";
const Drawer = createDrawerNavigator();
export default function HomeDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Kaizo" component={HomeScreenStack} />
      <Drawer.Screen name="Settings" component={SettingsScreen} />
    </Drawer.Navigator>
  );
}
