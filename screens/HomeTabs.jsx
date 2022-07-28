import "react-native-gesture-handler";
import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import HomeDrawer from "./HomeScreen";
import BudgetScreen from "./BudgetScreen";
import PListScreen from "./PListScreen";
import TravelScreen from "./TravelScreen";
import GPSScreen from "./GPSScreen";
import { selectUserData } from "../components/auth/AuthSlice";
import { useSelector } from "react-redux";

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  const user = useSelector(selectUserData);
  return (
    <Tab.Navigator
    initialRouteName= "Home Tab"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home Tab") {
            iconName = focused
              ? "home-sharp"
              : "home-outline";
          } else if (route.name === "Budget Tracker") {
            iconName = focused ? "cash-sharp" : "cash-outline";
          } else if (route.name === "Packing List") {
            iconName = focused ? "list-sharp" : "list-outline";
          } else if (route.name === "Travel Planner") {
            iconName = focused ? "airplane-sharp" : "airplane-outline";
          }else if (route.name === "Find Each Other") {
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
      <Tab.Screen name="Home Tab" component={HomeDrawer} />
      <Tab.Screen name="Budget Tracker" component={BudgetScreen} />
      <Tab.Screen name="Packing List" component={PListScreen} />
      <Tab.Screen name="Travel Planner" component={TravelScreen} />
      <Tab.Screen name="Find Each Other" children={props => <GPSScreen user={user} {...props} />} />
    </Tab.Navigator>
  );
}
