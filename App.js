import "react-native-gesture-handler";
import * as React from "react";
import store from "./redux/store";
import { Provider  } from "react-redux";
import Authentication from "./screens/Authentication";

export default function App() {
  return (
    <Provider store={store}>
      <Authentication/>
    </Provider>
  );
}

