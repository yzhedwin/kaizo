import * as React from "react";
import * as WebBrowser from "expo-web-browser";
import * as Google from 'expo-auth-session/providers/google';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { StatusBar } from "expo-status-bar";
import Button from "../components/Button";
import Firebase from "../components/auth/firebaseConfig";
WebBrowser.maybeCompleteAuthSession();


export default function GoogleSignIn() {
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
      signInWithCredential(auth, credential)
      .then((result) =>
      /*dispatch redux state*/
      console.log(result.user)
      );

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
          textStyle={styles.loginText}
          disabled={!request}
          title="Login"
          onPress={() => {
            promptAsync();
          }}
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
  logInButton: {
    alignItems: "center",
    margin: "100%",
    marginHorizontal: 70,
    paddingVertical: 15,
    borderRadius: 4,
    elevation: 5,
    backgroundColor: "black",
  },
  loginText: {
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
