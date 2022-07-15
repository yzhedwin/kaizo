import React, { useEffect, useState } from "react";
import { StyleSheet, View, Alert, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import MapView, { Marker, AnimatedRegion } from "react-native-maps";
const Scaledrone = require("scaledrone-react-native");
const SCALEDRONE_CHANNEL_ID = require("../scaledrone_channel_id.json");
const LOCATION_TASK_NAME = "LOCATION_TASK_NAME";
let foregroundSubscription = null;
const screen = Dimensions.get("window");
const ASPECT_RATIO = screen.width / screen.height;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;
// Define the background task for location tracking
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    // Extract location coordinates from data
    const { locations } = data;
    const location = locations[0];
    if (location) {
      console.log("Location in background", location.coords);
    }
  }
});

async function authRequest(clientId, name) {
  let status;
  return fetch("http://192.168.86.170:1234/auth", {
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

export default function Track() {
  // Define position state: {latitude: number, longitude: number}
  const [position, setPosition] = useState({ latitude: 1, longitude: 2 });
  const [members, setMembers] = useState([]);
  const [username, setUsername] = useState("");
  const [reRender, setReRender] = useState(false);

  // Request permissions right after starting the app
  useEffect(() => {
    const requestPermissions = async () => {
      const foreground = await Location.requestForegroundPermissionsAsync();
      if (foreground.granted)
        await Location.requestBackgroundPermissionsAsync();
    };
    requestPermissions();
    drone = new Scaledrone(SCALEDRONE_CHANNEL_ID);
    drone.on("error", (error) => console.error(error));
    drone.on("close", (reason) => console.error(reason));
    drone.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      Alert.prompt("Please insert your name", null, (name) => {
        setUsername(name);
        authRequest(drone.clientId, name).then((jwt) => drone.authenticate(jwt));
      });
    });

    room = drone.subscribe("observable-locations", {
      historyCount: 50, // load 50 past messages
    });
    startForegroundUpdate();
    //Get All Members
    room.on("members", function (members) {
      // List of members as an array
      console.log("Room joined");
      setMembers(members);
    });
    //New Member Joined
    room.on("member_join", (member) => {
      console.log("New Member joined");
      const newMembers = members.slice(0);
      newMembers.push(member);
      setMembers(newMembers);
    });
    // member left room
    room.on("member_leave", (member) => {
      console.log("Member has left");
      const newMembers = members.slice(0);
      const index = newMembers.findIndex((m) => m.id === member.id);
      if (index !== -1) {
        newMembers.splice(index, 1);
        setMembers(newMembers);
      }
    });
    
    // New Data 
    room.on("data", (data, member) => {
    console.log(members)
     updateLocation(data, member.id)
     setReRender(reRender * -1);
     console.log("New data updated")
    });

    return () => {
      stopForegroundUpdate();
      room.unsubscribe();
      drone.close();
      drone.on("close", (reason) => {
        console.error(reason);
        console.log("Connection has been closed");
      });
    };
  }, []);

  useEffect(() => {
    const { latitude, longitude } = position;
    room.on("open", (error) => {
      if (error) {
        return console.error(error);
      }
      // publish device's new location
      drone.publish({
        room: "observable-locations",
        message: { latitude, longitude },
      });
      console.log("published");
    });
  }, [position]);

  useEffect(() => {
    console.log("Force Update")
  }, [reRender]);

  // Start location tracking in foreground
  const startForegroundUpdate = async () => {
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
        setPosition(location.coords);
      }
    );
  };

  // Stop location tracking in foreground
  const stopForegroundUpdate = () => {
    foregroundSubscription?.remove();
    setPosition(null);
  };

  // Start location tracking in background
  const startBackgroundUpdate = async () => {
    // Don't track position if permission is not granted
    const { granted } = await Location.getBackgroundPermissionsAsync();
    if (!granted) {
      console.log("location tracking denied");
      return;
    }

    // Make sure the task is defined otherwise do not start tracking
    const isTaskDefined = await TaskManager.isTaskDefined(LOCATION_TASK_NAME);
    if (!isTaskDefined) {
    console.log("Task is not defined");
    return;
    }

    // Don't track if it is already running in background
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      console.log("Already started");
      return;
    }

    await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      // For better logs, we set the accuracy to the most sensitive option
      accuracy: Location.Accuracy.BestForNavigation,
      // Make sure to enable this notification if you want to consistently track in the background
      showsBackgroundLocationIndicator: true,
      foregroundService: {
        notificationTitle: "Location",
        notificationBody: "Location tracking in background",
        notificationColor: "#fff",
      },
    });
  };

  // Stop location tracking in background
  const stopBackgroundUpdate = async () => {
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TASK_NAME
    );
    if (hasStarted) {
      await Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
      console.log("Location tacking stopped");
    }
  };
  const createMarkers = () => {
    if (members.length > 0) {
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
  };
  const updateLocation = (data, memberId) => {
    const member = members.find((m) => m.id === memberId);
    if (!member) {
      // a history message might be sent from a user who is no longer online
      return;
    }
    // if (member.location) {
    //   member.location
    //     .timing({
    //       latitude: data.latitude,
    //       longitude: data.longitude,
    //     })
    //     .start();
    // } else {
    //   member = {...prev, location: new AnimatedRegion({
    //     latitude: data.latitude,
    //     longitude: data.longitude,
    //     latitudeDelta: LATITUDE_DELTA,
    //     longitudeDelta: LONGITUDE_DELTA,
    //   })}
    }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        <MapView
          style={styles.map}
          ref={(ref) => {
            this.map = ref;
          }}
          showsCompass={true}
          showsUserLocation={false}
        >
          {createMarkers()}
        </MapView>
      </View>
    </SafeAreaView>

    // <View style={styles.container}>
    //   <Text>Longitude: {position?.longitude}</Text>
    //   <Text>Latitude: {position?.latitude}</Text>
    //   <View style={styles.separator} />
    // </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  button: {
    marginTop: 15,
  },
  separator: {
    marginVertical: 8,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
