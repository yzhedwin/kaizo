import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DetailsScreen from "./DetailsScreen";
import { selectUserData, signOut } from "../components/auth/authSlice";
import { useSelector } from "react-redux";
import { getAuth } from "firebase/auth";
import Firebase from "../components/auth/firebaseConfig";
import { useDispatch } from "react-redux";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

const auth = getAuth(Firebase);
const HomeStack = createNativeStackNavigator();
const renderEmpty = () => {
  return (
  <SafeAreaView
    style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
  >
    <FocusAwareStatusBar style="dark-content" />
  </SafeAreaView>
  )
};
const render = (user, handleSignOut) => {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
    >
      <FocusAwareStatusBar barStyle='dark-content'/>
      <View style={styles.row}>
        <Text style={styles.title}>Welcome {user.displayName}!</Text>
      </View>
      <View>
        <Button
          title="Logout"
          size={24}
          color="black"
          onPress={handleSignOut}
        />
      </View>
      <Text style={styles.text}>Your UID is: {user.uid} </Text>
    </SafeAreaView>
  )
};
function HomeScreen() {
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

export default function HomeScreenStack() {
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
