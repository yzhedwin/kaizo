import { getAuth } from "firebase/auth";
import { Button, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import Firebase from "../components/firebase/Firebase";
import { selectUserData, signOut } from "../components/slicers/authSlice";
import { FocusAwareStatusBar } from "../components/statusbar/FocusAwareStatusBar";

const auth = getAuth(Firebase);
const renderEmpty = () => {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
    >
      <FocusAwareStatusBar style="dark-content" />
    </SafeAreaView>
  );
};
const render = (user, handleSignOut) => {
  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "space-between", alignItems: "center" }}
    >
      <FocusAwareStatusBar barStyle="dark-content" />
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
  );
};
export default function HomeScreen() {
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
