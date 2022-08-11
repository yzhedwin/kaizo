import "react-native-gesture-handler";
import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import BudgetScreen from "../../screens/budget";
import PListScreen from "../../screens/PListScreen";
import TravelScreen from "../../screens/TravelScreen";
import GPSScreen from "../../screens/GPSScreen";
import { useSelector } from "react-redux";
import HomeDrawer from "../drawers/HomeDrawer";
import Loto from "../../screens/Loto";
import { Image } from "react-native";
import { selectUserData } from "../slicers/authSlice";

const image = require("../../../assets/spool.jpeg");
const image_focus = require("../../../assets/spool-focus.jpg");
const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  const user = useSelector(selectUserData);
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Loto") {
            return (
              <Image
                style={{ width: size, height: size }}
                source={(iconName = focused ? image_focus : image)}
              />
            );
          } else if (route.name === "Home") {
            iconName = focused ? "home-sharp" : "home-outline";
          } else if (route.name === "Budget Tracker") {
            iconName = focused ? "cash-sharp" : "cash-outline";
          } else if (route.name === "Packing List") {
            iconName = focused ? "list-sharp" : "list-outline";
          } else if (route.name === "Travel Planner") {
            iconName = focused ? "airplane-sharp" : "airplane-outline";
          } else if (route.name === "Find Each Other") {
            iconName = focused ? "earth-sharp" : "earth-outline";
          }
          // You can return any component that you like here!
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "gray",
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeDrawer} />
      <Tab.Screen name="Budget Tracker" component={BudgetScreen} />
      <Tab.Screen name="Packing List" component={PListScreen} />
      {/* <Tab.Screen
        name="Loto"
        children={(props) => <Loto user={user} {...props} />}
      /> */}
      <Tab.Screen name="Travel Planner" component={TravelScreen} />
      <Tab.Screen
        name="Find Each Other"
        children={(props) => <GPSScreen user={user} {...props} />}
      />
    </Tab.Navigator>
  );
}
