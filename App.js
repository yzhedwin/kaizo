import "react-native-gesture-handler";
import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer, DarkTheme } from "@react-navigation/native";
import HomeTabs from "./screens/HomeTabs";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LoginScreen from "./screens/LoginScreen";
import { AuthenticatedUserContext, AuthenticatedUserProvider } from "./components/navigation/AuthenticatedUserProvider";
import GoogleSignIn from "./screens/GoogleSignIn";

export default function App() {
  const { user } = React.useContext(AuthenticatedUserContext);
  console.log(user)
  const Stack = createStackNavigator();
  return (
    <AuthenticatedUserProvider>
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <Stack.Screen name="SignIn" component={GoogleSignIn} />
          ) : (
            <Stack.Screen name="Home" component={HomeTabs} />
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    </AuthenticatedUserProvider>
  );
}

