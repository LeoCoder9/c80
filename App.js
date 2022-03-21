import React from "react";

import Home from "./screens/Home";
import ISSTracker from "./screens/ISSTracker";
import Meteor from "./screens/Meteor";

import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

const Stack = createStackNavigator();

export default class App extends React.Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}
        >
          <Stack.Screen name="Home" component={Home} />
          <Stack.Screen name="IssLocation" component={ISSTracker} />
          <Stack.Screen name="Meteors" component={Meteor} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
