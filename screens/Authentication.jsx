import "react-native-gesture-handler";
import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import HomeTabs from "./HomeTabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import GoogleSignIn from "./GoogleSignIn";
import { useSelector } from "react-redux";
import { useState } from "react";

export default function Authentication() {
  const isAuthenticated = useSelector((state) => state.auth.isSignIn);
  console.log("USER IS SIGNED IN: " + isAuthenticated);
  const Stack = createStackNavigator();
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <Stack.Screen name="SignIn" component={GoogleSignIn} />
          ) : (
            <Stack.Screen name="Home" component={HomeTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
