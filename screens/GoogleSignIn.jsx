import * as React from 'react';
import * as WebBrowser from 'expo-web-browser';
import { ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { Button } from 'react-native';
import Firebase from '../components/auth/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';



WebBrowser.maybeCompleteAuthSession();

export default function GoogleSignIn() {

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
    {
      clientId: Constants.manifest.extra.googleClient,
      },
  );

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const auth = Firebase.auth();
      const provider = new GoogleAuthProvider();
      const credential = provider.credential(id_token);
      signInWithCredential(auth, credential);
    }
  }, [response]);

  return (
    <SafeAreaView>
    <Button
      disabled={!request}
      title="Login"
      onPress={() => {
        promptAsync();
        }}
    />
    </SafeAreaView>
  );
}