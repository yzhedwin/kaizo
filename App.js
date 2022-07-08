import React from "react";
import { createTheme, ThemeProvider } from "@rneui/themed";
import { View, Text, Button, Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Home from "./screens/HomeScreen";
import NavBar from "./components/NavBar";
import { Header } from "@rneui/base";
import { SafeAreaProvider } from "react-native-safe-area-context";

const theme = createTheme({
  lightColors: {},
  darkColors: {},
});

function DetailsScreen({navigation}) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push('Details')}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate('Home')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

function LogoTitle() {
  return (
    <Image
      style={{ width: 50, height: 50 }}
      source={require('./assets/favicon.png')}
    />
  );
}

const Stack = createNativeStackNavigator();
export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" 
        component={Home} 
        options={{
          headerTitle: props => <LogoTitle {...props} />,
          headerRight: () => (
            <Button
              onPress={() => alert('This is a button!')}
              title="Info"
              color="black"
            />
          ),
        }}
        />
        <Stack.Screen name="Details"
         component={DetailsScreen} 
         />
      </Stack.Navigator>
       </NavigationContainer>
    </ThemeProvider>
  );
}
