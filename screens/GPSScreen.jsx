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

let foregroundSubscription = null;

const screen = Dimensions.get("window");

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export default class GPSScreen extends Component {
  constructor() {
    super();
    this.state = {
      members: [],
      position: {},
    };
  }
  componentWillUnmount() {}

  async requestPermissions() {
    const foreground = await Location.requestForegroundPermissionsAsync();
    if (foreground.granted) await Location.requestBackgroundPermissionsAsync();
  }
  componentDidMount() {
    this.requestPermissions();
    const { latitude, longitude } = this.state.position;
  }

  // Start location tracking in foreground
  async startForegroundUpdate() {
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

  updateLocation() {}

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar style="dark-content" />
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <Text>GPS SCREEN</Text>
        </View>
      </SafeAreaView>
    );
  }
}
