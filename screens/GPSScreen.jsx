import React, { Component } from "react";
import { StyleSheet, View, Text, Dimensions, SafeAreaView } from "react-native";
import * as Location from "expo-location";
import MapView, {
  Marker,
  AnimatedRegion,
  PROVIDER_GOOGLE,
} from "react-native-maps";
import { FocusAwareStatusBar } from "../components/FocusAwareStatusBar";

const Scaledrone = require("scaledrone-react-native");
const SCALEDRONE_CHANNEL_ID = require("../scaledrone_channel_id.json");

let foregroundSubscription = null;
const screen = Dimensions.get("window");

const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
const initialRegion = {
  latitude: -37.112146,
  longitude: 144.857483,
  latitudeDelta: LATITUDE_DELTA,
  longitudeDelta: LONGITUDE_DELTA,
};
const BASE_URL = "http://192.168.86.76";
const SERVER_PORT = ":1234";
const ROOM_LOCATION = "observable-location";
let drone;
let room;
let status;
class GPSScreen extends Component {
  constructor() {
    super();
    this.state = {
      members: [],
      position: {},
      region: { initialRegion },
    };
  }
  onRegionChange = (region) => {
    console.log("onRegionChange", region);
  };

  onRegionChangeComplete = (region) => {
    console.log("onRegionChangeComplete", region);
  };

  componentWillUnmount() {
    //unsub
    this.stopForegroundUpdate();
    room.unsubscribe();
    drone.close();
    drone.on("close", (reason) => {
      console.error(reason);
      console.log("Connection has been closed");
    });
    drone.on("disconnect", () => {
      // User has disconnected, Scaledrone will try to reconnect soon
      console.log("Connection has been disconnected");
    });
  }
  componentDidMount() {
    this.requestPermissions();
    this.startForegroundUpdate();
    drone = new Scaledrone(SCALEDRONE_CHANNEL_ID);
    drone.on("error", (error) => {
      console.log("Error Initialising Scaledrone Client");
      console.error(error);
    });
    drone.on("close", (reason) => console.error(reason));
    drone.on("open", (error) => {
      if (error) {
        console.log("Error Initialising Scaledrone Client");
        return console.error(error);
      }
      this.authRequest(drone.clientId, this.props.user)
        .then((jwt) => drone.authenticate(jwt))
        .catch((error) => console.log(error));
    });
    drone.on("authenticate", function (error) {
      if (error) {
        return console.error(error);
      }
      // Client is now authenticated and ready to start working
      console.log("Client is authenticated");
    });
    room = drone.subscribe(ROOM_LOCATION, {
      historyCount: 50, // load 50 past messages
    });
    this.startForegroundUpdate();

    room.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      const { latitude, longitude } = this.state.position;
      // publish device's new location
      //this.publishLocation(this.props.user.uid, this.props.user.displayName);
      drone.publish({
        room: ROOM_LOCATION,
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
    room.on("members", (members) =>
      this.setState((prevState) => ({ ...prevState, members: members }))
    );
    // new member joined room
    room.on("member_join", (member) => {
      const members = this.state.members.slice(0);
      members.push(member);
      this.setState((prevState) => ({ ...prevState, members: members }));
    });
    // member left room
    room.on("member_leave", (member) => {
      const members = this.state.members.slice(0);
      const index = members.findIndex((m) => m.id === member.id);
      if (index !== -1) {
        members.splice(index, 1);
        this.setState((prevState) => ({ ...prevState, members: members }));
      }
    });

    console.log("GPS MOUNTED");
  }

  componentDidUpdate() {}

  async requestPermissions() {
    const foreground = await Location.requestForegroundPermissionsAsync();
    if (foreground.granted) await Location.requestBackgroundPermissionsAsync();
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
        const region = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        };
        this.setState((prevState) => ({
          ...prevState,
          position: location.coords,
          region: region,
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
        location: { latitude, longitude },
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
  //store data to firestore and scaledrone
  async authRequest(clientId, userData) {
    const { displayName } = userData;
    return fetch(BASE_URL + SERVER_PORT + "/auth", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ clientId, displayName }),
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

  //TODO List members on drawer
  createMembers() {
    const { members } = this.state;
    return members.map((member) => {
      const { displayName, color } = member.authData;
      return (
        <View key={member.id} style={styles.member}>
          <View style={[styles.avatar, { backgroundColor: color }]}></View>
          <Text style={styles.memberName}>{displayName} [Last Seen: ]</Text>
        </View>
      );
    });
  }
  createMarkers() {
    const { members } = this.state;
    const membersWithLocations = members.filter((m) => !!m.location);
    return membersWithLocations.map((member) => {
      const { id, location, authData } = member;
      const { displayName, color } = authData;
      return (
        <Marker.Animated
          key={id}
          identifier={id}
          coordinate={location}
          pinColor={color}
          title={displayName}
        />
      );
    });
  }
  render() {
    return (
      <SafeAreaView style={{ flex: 0.75 }}>
        <FocusAwareStatusBar barStyle="dark-content" />
        <View style={{ flex: 1, paddingHorizontal: 20 }}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            ref={(ref) => {
              this.map = ref;
            }}
            region={this.state.region}
            onRegionChange={this.onRegionChange}
            onRegionChangeComplete={this.onRegionChangeComplete}
          >
            {this.createMarkers()}
          </MapView>
        </View>
        <View>
          <Text>Drag Up to see Who is connected</Text>
        </View>
        {this.createMembers()}
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
