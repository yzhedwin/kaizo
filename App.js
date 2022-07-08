import React from "react";
import { createTheme, ThemeProvider } from "@rneui/themed";
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./screens/HomeScreen";

const theme = createTheme({
  lightColors: {},
  darkColors: {},
});

function DetailsScreen() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
    </View>
  );
}
const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
       </NavigationContainer>
    </ThemeProvider>
  );
}
