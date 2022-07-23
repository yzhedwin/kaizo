import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DetailsScreen from "./DetailsScreen";
import { Drawer, SettingsScreen } from "./SettingsScreen";
import { StatusBar } from "expo-status-bar";
import { selectUserData, signOut } from "../components/auth/authSlice";
import { useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import Firebase from "../components/auth/firebaseConfig";
import { useDispatch } from "react-redux";

const HomeStack = createNativeStackNavigator();
const auth = getAuth(Firebase);

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
const renderEmpty = () => {
  return (
  <SafeAreaView
    style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
  >
    <StatusBar style="dark-content" />
  </SafeAreaView>
  )
};
const render = (user, handleSignOut) => {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
    >
      <StatusBar style="dark-content" />
      <View style={styles.row}>
        <Text style={styles.title}>Welcome {user.displayName}!</Text>
      </View>
      <View>
        <Button
          title="logout"
          size={24}
          color="black"
          onPress={handleSignOut}
        />
      </View>
      <Text style={styles.text}>Your UID is: {user.uid} </Text>
    </SafeAreaView>
  )
};
export function HomeScreen() {
  const dispatch = useDispatch();
  const handleSignOut = async () => {
    try {
      await auth.signOut().then(() => {
        dispatch(signOut());
        console.log("User has logged out");
      });
    } catch (error) {
      console.log(error);
    }
  };
  const user = useSelector(selectUserData);
  return user === null ? renderEmpty() : render(user, handleSignOut);
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "black",
  },
  text: {
    fontSize: 16,
    fontWeight: "normal",
    color: "black",
  },
});
