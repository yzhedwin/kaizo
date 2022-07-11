import { Button, Text, View } from "react-native";

export default function DetailsScreen({ navigation }) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Details!</Text>
        <Button
        title="Go to HomePage"
        onPress={() => navigation.navigate("HomeScreen")}
      />
      </View>
    );
  }