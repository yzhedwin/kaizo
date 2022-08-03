import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithCredential,
} from "firebase/auth";
import {
  Alert,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";
import Firebase from "../components/auth/firebaseConfig";
import { signIn } from "../components/auth/authSlice";
import { useDispatch } from "react-redux";
const image = require("../assets/kaizo-splash.png");

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
        const { uid, displayName, email, photoURL, accessToken } = result.user;
        dispatch(
          signIn({
            data: { uid, displayName, email, photoURL },
            token: { accessToken },
          })
        );
      });
    } else {
      console.log("Login failed");
      if (Platform.OS !== "web") {
        Alert.alert("Kaizo Login", "Failed to login. Please try again");
      }
    }
  }, [response]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#86d8f7" }}>
      <StatusBar style="dark-content" />
      <ImageBackground source={image} resizeMode="cover" style={styles.img}>
        <View style={styles.pageContainer}>
          <View style={styles.titleView}>
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
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  title: {
    fontSize: 40,
    color: "white",
    fontWeight: "bold",
  },
  titleView: {
    alignSelf: "center",
  },
  signUpButton: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    borderRadius: 4,
    elevation: 5,
    backgroundColor: "black",
  },
  logInButton: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    marginHorizontal: 20,
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
    display: "flex",
    flexDirection: "row",
  },
  pageContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "space-evenly",
  },
  img: {
    display: "flex",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
});
