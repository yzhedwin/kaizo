import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { Colors, Typography } from "../../utils/Styles";
import { selectUserData } from "../slicers/authSlice";

//add Text style
const BudgetHeader = () => {
  const navigation = useNavigation();
  const user = useSelector(selectUserData);

  return (
    <View style={styles.container}>
      <View>
        <Text style={[Typography.TAGLINE, { color: Colors.WHITE },]}>
          Welcome back,
        </Text>

        <Text style={[Typography.H2, { color: Colors.WHITE }]}>
          {user.displayName}
        </Text>
      </View>
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
