// v9 compat packages are API compatible with v8 code
import { initializeApp } from 'firebase/app';
import 'firebase/auth';
import Constants from 'expo-constants';
//import { getMessaging } from "firebase/messaging";

// Initialize Firebase
export const firebaseConfig = {
  apiKey: Constants.manifest.extra.apiKey,
  authDomain: Constants.manifest.extra.authDomain,
  projectId: Constants.manifest.extra.projectId,
  storageBucket: Constants.manifest.extra.storageBucket,
  messagingSenderId: Constants.manifest.extra.messagingSenderId,
  appId: Constants.manifest.extra.appId
};
const Firebase = initializeApp(firebaseConfig);

//export const messaging = getMessaging(Firebase)
export default Firebase;