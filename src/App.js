import "react-native-gesture-handler";
import * as React from "react";
import { Provider } from "react-redux";
import Authentication from "./screens/Authentication";
import store from "./redux/store";

export default function App() {
  return (
    <Provider store={store}>
      <Authentication/>
    </Provider>
  );
}

