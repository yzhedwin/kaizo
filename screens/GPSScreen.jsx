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
import MapView ,{ PROVIDER_GOOGLE } from "react-native-maps";
import Constants from "expo-constants";
let foregroundSubscription = null;

const screen = Dimensions.get("window");

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const BASE_URL = "http://192.168.86.174";
const SERVER_PORT = ":1234";
let status;


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
  }
  componentDidMount() {
    this.requestPermissions();
    //Get Token
    getToken(messaging, {
      vapidKey: Constants.manifest.extra.cloudMessagingKey,
    })
      .then((currentToken) => {
        if (currentToken) {
          // Send the token to your server and update the UI if necessary
          // Send User info and topic subscribed
          // Subscribe to GPS
          this.registerMessagingToken(this.props.user.displayName, currentToken);
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
    this.startForegroundUpdate();
    // Read Messages
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload.data.name);
      // ...
    });
    //Publish current location changes (backend)
    const { latitude, longitude } = this.state.position;
    if (latitude && longitude) {
      this.publishLocation(this.props.user.displayName, {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
      });
    }
    // Send location to Firestore
    // Update all new locations
    // Update connections

    console.log("GPS MOUNTED");
  }

  componentDidUpdate() {}

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
    setPosition(null);
  }
  // Get all user locations
  updateUsersLocation() {}

  //send curr pos to server
  async publishLocation(username, position) {
    //TODO
    return fetch(BASE_URL + SERVER_PORT + "/publish", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, position }),
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
  async registerMessagingToken(username, regToken) {
    return fetch(BASE_URL + SERVER_PORT + "/register", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, regToken }),
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
          >
          </MapView>
          <Text>Longitude: {this.state.position.longitude}</Text>
          <Text>Lattitude: {this.state.position.latitude}</Text>
        </View>
      </SafeAreaView>
    );
  }
}
export default GPSScreen

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})