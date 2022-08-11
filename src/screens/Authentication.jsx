import "react-native-gesture-handler";
import * as React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import GoogleSignIn from "./GoogleSignIn";
import { useSelector } from "react-redux";
import HomeTabs from "../components/tabs/HomeTabs";
import HomeScreen from "./HomeScreen";
import { StyleSheet } from "react-native";
import TransactionScreen from "./budget/TransactionScreen";
import AddExpense from "./budget/AddExpense";

export default function Authentication() {
  const isAuthenticated = useSelector((state) => state.auth.isSignIn);
  console.log("USER IS SIGNED IN: " + isAuthenticated);
  const Stack = createStackNavigator();
  return (
    <SafeAreaView style={styles.container}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!isAuthenticated ? (
            <>
              <Stack.Screen name="SignIn" component={GoogleSignIn} />
            </>
          ) : (
            <>
              <Stack.Screen name="HomeTabs" component={HomeTabs} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Transactions" component={TransactionScreen} />
              <Stack.Screen name="AddExpense" component={AddExpense} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
