import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { getToken, onMessage } from "@firebase/messaging";
import { messaging } from "../components/auth/FirebaseConfig";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import Constants from "expo-constants";
let foregroundSubscription = null;

const screen = Dimensions.get("window");

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const BASE_URL = "http://192.168.79.18"; //"http://192.168.86.174";
const SERVER_PORT = ":1234";
let status;
let animationFrameId = 0;
const API_REFRESH_RATE = 5000;

class GPSScreen extends Component {
  constructor() {
    super();
    this.state = {
      members: [],
      position: {},
    };
  }
  componentWillUnmount() {
    //unsub
    window.clearInterval(animationFrameId);
    this.stopForegroundUpdate();
  }
  componentDidMount() {
    this.requestPermissions();
    this.startForegroundUpdate();
    //Get Token
    getToken(messaging, {
      vapidKey: Constants.manifest.extra.cloudMessagingKey,
    })
      .then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          // Send User info and topic subscribed
          // Subscribe to GPS
          this.registerMessagingToken(
            this.props.user.uid,
            this.props.user.displayName,
            currentToken
          );
        } else {
          // Show permission request UI
          console.log(
            "No registration token available. Request permission to generate one."
          );
          // ...
        }
      })
      .catch((err) => {
        console.log("An error occurred while retrieving token. ", err);
        // ...
      });

    // Read Messages
    // uid -> birth, name
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      const { birth, name, uid, color } = payload.data;
      const { latitude, longitude } = payload.data;
      // TODO: Update state
      if (birth) {
        const members = this.state.members.slice(0);
        const newObj = { uid, name, birth, color };
        let isRegistered = false;
        for (const x of members) {
          if (x.uid === newObj.uid) {
            isRegistered = true;
          }
        }
        if (!isRegistered) {
          members.push(newObj);
          console.log(members);
          this.setState((prevState) => ({ ...prevState, members: members }));
        } else {
          //Get member based on uid then update object location
          console.log("Update location");
        }
      } else {
        console.log("Member alr registered");
      }
    });
    // Send location to Firestore
    // Update all new locations
    // Update connections

    console.log("GPS MOUNTED");
  }

  componentDidUpdate() {
    //Publish location changes (backend)
    this.publishLocation(this.props.user.uid, this.props.user.displayName,);
  }

  async requestPermissions() {
    const foreground = await Location.requestForegroundPermissionsAsync();
    if (foreground.granted) await Location.requestBackgroundPermissionsAsync();
  }

  // Start location tracking in foreground
  async startForegroundUpdate() {
    console.log("GPS updated");
    // Check if foreground permission is granted
    const { granted } = await Location.getForegroundPermissionsAsync();
    if (!granted) {
      console.log("location tracking denied");
      return;
    }
    // Make sure that foreground location tracking is not running
    foregroundSubscription?.remove();

    // Start watching position in real-time
    foregroundSubscription = await Location.watchPositionAsync(
      {
        // For better logs, we set the accuracy to the most sensitive option
        accuracy: Location.Accuracy.BestForNavigation,
      },
      (location) => {
        this.setState((prevState) => ({
          ...prevState,
          position: location.coords,
        }));
      }
    );
  }

  // Stop location tracking in foreground
  stopForegroundUpdate() {
    foregroundSubscription?.remove();
    this.setState((prevState) => ({
      ...prevState,
      position: null,
    }));
  }
  // Get all user locations
  updateLocation(data, memberId) {
    const { members } = this.state;
    const member = members.find((m) => m.id === memberId);
    if (!member) {
      // a history message might be sent from a user who is no longer online
      return;
    }
    if (member.location) {
      member.location
        .timing({
          latitude: data.latitude,
          longitude: data.longitude,
        })
        .start();
    } else {
      member.location = new AnimatedRegion({
        latitude: data.latitude,
        longitude: data.longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA,
      });
      this.forceUpdate();
    }
  }

  //send curr pos to server
  async publishLocation(uid, username) {
    //Get Curr position
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    //TODO
    return fetch(BASE_URL + SERVER_PORT + "/publish", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid,
        username,
        position: { latitude, longitude },
      }),
    })
      .then((res) => {
        status = res.status;
        return res.text();
      })
      .then((text) => {
        if (status === 200) {
          console.log("Position published successfully");
          return text;
        } else {
          alert(text);
        }
      })
      .catch((error) => console.error(error));
  }
  async registerMessagingToken(uid, username, regToken) {
    //Init Position
    let location = await Location.getCurrentPositionAsync({});
    const { latitude, longitude } = location.coords;
    return fetch(BASE_URL + SERVER_PORT + "/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        uid,
        username,
        position: { latitude, longitude },
        regToken,
      }),
    })
      .then((res) => {
        status = res.status;
        return res.text();
      })
      .then((text) => {
        if (status === 200) {
          console.log("Registered successfully");
          return text;
        } else {
          alert(text);
        }
      })
      .catch((error) => console.error(error));
  }

  //TODO List members on drawer
  createMembers() {
    const { members } = this.state;
    let id = 0;
    return members.map((member) => {
      const { name, color } = member;
      id++;
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <View key={id} style={styles.member}>
            <View style={[styles.avatar, { backgroundColor: color }]}></View>
            <Text style={styles.memberName}>{name}</Text>
          </View>
        </SafeAreaView>
      );
    });
  }

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="dark-content" />
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            ref={(ref) => {
              this.map = ref;
            }}
            initialRegion={{
              latitude: 37.600425,
              longitude: -122.385861,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}
          ></MapView>
        </View>
      </SafeAreaView>
    );
  }
}
export default GPSScreen;

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
    marginRight: 20,
  },
  latlng: {
    width: 200,
    alignItems: "stretch",
  },
  button: {
    width: 80,
    paddingHorizontal: 12,
    alignItems: "center",
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    marginVertical: 50,
    backgroundColor: "transparent",
  },
  members: {
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    width: "100%",
    paddingHorizontal: 10,
  },
  member: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,1)",
    borderRadius: 20,
    height: 30,
    marginTop: 10,
  },
  memberName: {
    marginHorizontal: 10,
  },
  avatar: {
    height: 30,
    width: 30,
    borderRadius: 15,
  },
});
