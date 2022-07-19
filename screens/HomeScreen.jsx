import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DetailsScreen from "./DetailsScreen";
import { Drawer, SettingsScreen } from "./SettingsScreen";
import { StatusBar } from 'expo-status-bar';
import { useContext } from "react";
import { AuthenticatedUserContext } from "../components/navigation/AuthenticatedUserProvider";

const HomeStack = createNativeStackNavigator();
const handleSignOut = async () => {
  try {
    await auth.signOut();
  } catch (error) {
    console.log(error);
  }
};
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
  const { user } = useContext(AuthenticatedUserContext);
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
    >
      <StatusBar style='dark-content' />
      <View style={styles.row}>
        <Text style={styles.title}>Welcome {user}!</Text>
        </View>
        <View>
        <Button
          title="logout"
          size={24}
          color='black'
          onPress={handleSignOut}
        />
        </View>
      <Text style={styles.text}>Your UID is: {user} </Text>
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

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black'
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal',
    color: 'black'
  }
});