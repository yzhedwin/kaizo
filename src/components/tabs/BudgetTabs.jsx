// import Income from "./income";
// import Expense from "./expense";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import Budget from "../../screens/budget/Budget";
import Expense from "../../screens/budget/Expense";

// Top Tabs
const Tab = createMaterialTopTabNavigator();

export default function BudgetTabs(props) {
  return (
    <Tab.Navigator
      screenOptions={{
        lazy: true,
        tabBarActiveTintColor: "gray",
        tabBarLabelStyle: { color: "white" },
        tabBarStyle: {
          backgroundColor: "black",
        },
        tabBarIndicatorStyle: {
          backgroundColor: "lime",
        },
        swipeEnabled: false,
        animationEnabled: true,
      }}
    >
      <Tab.Screen
        name="Budget"
        options={{ tabBarLabel: "Budget" }}
        component={Budget}
      />
      <Tab.Screen
        name="Expenses"
        options={{ tabBarLabel: "Expense" }}
        component={Expense}
      />
    </Tab.Navigator>
  );
}
