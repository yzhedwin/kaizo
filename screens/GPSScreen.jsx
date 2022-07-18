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
import MapView, { Marker, AnimatedRegion, PROVIDER_GOOGLE } from "react-native-maps";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
const Scaledrone = require("scaledrone-react-native");
const SCALEDRONE_CHANNEL_ID = require("../scaledrone_channel_id.json");
const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";
let foregroundSubscription = null;

const screen = Dimensions.get("window");

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
let drone;
let room;
export default class GPSScreen extends Component {
  constructor() {
    super();
    this.state = {
      members: [],
      position: {},
    };
  }
  componentWillUnmount() {
    room.unsubscribe();
    drone.close();
    drone.on("close", (reason) => {
      console.error(reason);
      console.log("Connection has been closed");
    });
    drone.on("disconnect", () => {
      // User has disconnected, Scaledrone will try to reconnect soon
    });
  }

  async requestPermissions() {
    const foreground = await Location.requestForegroundPermissionsAsync();
    if (foreground.granted) await Location.requestBackgroundPermissionsAsync();
  }
  //TODO: Use Google Maps, Use Expo Location
  componentDidMount() {
    this.requestPermissions();
    drone = new Scaledrone(SCALEDRONE_CHANNEL_ID);
    drone.on("error", (error) => console.error(error));
    drone.on("close", (reason) => console.error(reason));
    drone.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      Alert.prompt("Please insert your name", null, (name) =>
        authRequest(drone.clientId, name).then((jwt) => drone.authenticate(jwt))
      );
    });
    room = drone.subscribe("observable-locations", {
      historyCount: 50, // load 50 past messages
    });
    this.startForegroundUpdate();

    room.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      const { latitude, longitude } = this.state.position;
        // publish device's new location
        drone.publish({
          room: "observable-locations",
          message: { latitude, longitude },
        });
      });
    // received past message
    room.on("history_message", (message) =>
      this.updateLocation(message.data, message.clientId)
    );
    // received new message
    room.on("data", (data, member) => this.updateLocation(data, member.id));
    // array of all connected members
    room.on("members", (members) => this.setState((prevState) => ({ ...prevState,  members:members })))
    // new member joined room
    room.on("member_join", (member) => {
      const members = this.state.members.slice(0);
      members.push(member);
      this.setState((prevState) => ({ ...prevState,   members:members}));
    });
    // member left room
    room.on("member_leave", (member) => {
      const members = this.state.members.slice(0);
      const index = members.findIndex((m) => m.id === member.id);
      if (index !== -1) {
        members.splice(index, 1);
        this.setState((prevState) => ({ ...prevState,  members: members }));
      }
    });
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
        this.setState((prevState) => ({ ...prevState,
          position: location.coords
        })); 
            }
    );
  }

  // Stop location tracking in foreground
  stopForegroundUpdate() {
    foregroundSubscription?.remove();
    setPosition(null);
  }

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

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
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
            {this.createMarkers()}
          </MapView>
          <View pointerEvents="none" style={styles.members}>
            {this.createMembers()}
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => this.fitToMarkersToMap()}
              style={[styles.bubble, styles.button]}
            >
              <Text>Fit Markers Onto Map</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  createMarkers() {
    const { members } = this.state;
    const membersWithLocations = members.filter((m) => !!m.location);
    return membersWithLocations.map((member) => {
      const { id, location, authData } = member;
      const { name, color } = authData;
      return (
        <Marker.Animated
          key={id}
          identifier={id}
          coordinate={location}
          pinColor={color}
          title={name}
        />
      );
    });
  }

  createMembers() {
    const { members } = this.state;
    return members.map((member) => {
      const { name, color } = member.authData;
      return (
        <SafeAreaView style={{ flex: 1 }}>
          <View key={member.id} style={styles.member}>
            <View style={[styles.avatar, { backgroundColor: color }]}></View>
            <Text style={styles.memberName}>{name}</Text>
          </View>
        </SafeAreaView>
      );
    });
  }

  fitToMarkersToMap() {
    const { members } = this.state;
    this.map.fitToSuppliedMarkers(
      members.map((m) => m.id),
      true
    );
  }
}

async function authRequest(clientId, name) {
  let status;
  return fetch("http://192.168.79.3:1234/auth", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ clientId, name }),
  })
    .then((res) => {
      status = res.status;
      return res.text();
    })
    .then((text) => {
      if (status === 200) {
        return text;
      } else {
        alert(text);
      }
    })
    .catch((error) => console.error(error));
}

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
