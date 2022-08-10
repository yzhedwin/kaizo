import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { selectUserData } from "../auth/authSlice";

//add Text style
const BudgetHeader = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUserData);

  return (
    <View style={styles.container}>
      <View>
        <Text style={{ fontSize: 16, color: "white" }}>Welcome back,</Text>
        <Text style={{ fontSize: 24, color: "white" }}>{user.displayName}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => navigation.navigate(routes.AddExpenses)}
      >
        <Ionicons name="add-circle-outline" color={"white"} size={40} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "black",
  },
});
export default BudgetHeader;
