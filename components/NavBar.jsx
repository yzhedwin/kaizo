import * as React from "react";
import { Header, Icon } from "@rneui/base";

export default () => {
  return (
    <Header
      backgroundImageStyle={{}}
      barStyle="default"
      centerComponent={{
        text: "BTO App",
        style: { color: "#fff" }
      }}
      centerContainerStyle={{}}
      containerStyle={{ width: 350 }}
      leftComponent={{ icon: "menu", color: "#fff" }}
      leftContainerStyle={{}}
      linearGradientProps={{}}
      placement="center"
      rightComponent={{ icon: "home", color: "#fff" }}
      rightContainerStyle={{}}
      statusBarProps={{}}
    />
  );
}