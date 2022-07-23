import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import { Alert, Platform, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";
import Firebase from "../components/auth/firebaseConfig";
import { signIn } from "../components/auth/authSlice";
import { useDispatch } from "react-redux";

WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn() {
  const dispatch = useDispatch();
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    expoClientId: Constants.manifest.extra.googleClient,
    webClientId: Constants.manifest.extra.googleClient,
    androidClientId: Constants.manifest.extra.androidClient,
  });

  React.useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;
      const auth = getAuth(Firebase);
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then((result) => {
        /*Update user authorization*/
        const {uid, displayName, email} = result.user;
        const {accessToken} = result.user;
        dispatch(signIn({
          data: {uid, displayName, email},
          token: {accessToken}
        }));
      });
    } else {
      console.log("Login failed")
      if (Platform.OS !== "web") {
       Alert.prompt("Kaizo Login", "Failed to login. Please try again")
      }
    }
  }, [response]);

  return (
    <SafeAreaView style={{ backgroundColor: "white" }}>
      <StatusBar style="dark-content" />
      <View style={styles.titleView}>
        <Text style={styles.title}>Kaizo</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          buttonStyle={styles.logInButton}
          textStyle={styles.logInText}
          disabled={!request}
          title="Login with Google"
          onPress={() => {
            promptAsync();
          }}
        />
        <Button
          buttonStyle={styles.signUpButton}
          textStyle={styles.logInText}
          title="Sign up"
          //onPress={}
        />
      </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    fontWeight: "bold",
  },
  titleView: {
    alignItems: "center",
    backgroundColor: "#6495ed",
  },
  signUpButton: {
    alignItems: "center",
    margin: "100%",
    marginHorizontal: 70,
    paddingVertical: 15,
    borderRadius: 4,
    elevation: 5,
    backgroundColor: "black",
  },
  logInButton: {
    alignItems: "center",
    margin: "100%",
    marginHorizontal: 70,
    paddingVertical: 15,
    borderRadius: 4,
    elevation: 5,
    backgroundColor: "black",
  },
  logInText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
  },
  buttonContainer: {
    backgroundColor: "#86d8f7",
  },
});
