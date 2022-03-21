import axios from "axios";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  SafeAreaView,
  ImageBackground,
  Image,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Alert } from "react-native-web";

export default class ISSTracker extends React.Component {
  constructor() {
    super();
    this.state = {
      location: {},
    };
  }

  getIssLocation = () => {
    axios
      .get("https://api.wheretheiss.at/v1/satellites/25544")
      .then((response) => {
        this.setState({ location: response.data });
      })
      .catch((error) => {
        Alert.alert(error.message);
        console.log(error.message);
      });
  };

  componentDidMount() {
    this.getIssLocation();
  }

  render() {
    console.log(this.state.location);

    if (Object.keys(this.state.location).length == 0) {
      return (
        <View>
          <Text>Loading..</Text>
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <SafeAreaView style={styles.droidSafeArea} />
          <ImageBackground
            style={styles.backgroundImage}
            source={require("../assets/bg.png")}
          >
            <View style={styles.titleBar}>
              <Text style={styles.titleText}>ISS Locator</Text>
            </View>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                region={{
                  latitude: this.state.location.latitude,
                  longitude: this.state.location.longitude,
                  latitudeDelta: 100,
                  longitudeDelta: 100,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: this.state.location.latitude,
                    longitude: this.state.location.longitude,
                  }}
                >
                  <Image
                    style={{ width: 50, height: 50 }}
                    source={require("../assets/iss_icon.png")}
                  ></Image>
                </Marker>
              </MapView>
            </View>
          </ImageBackground>
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  droidSafeArea: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
  },

  titleBar: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "white",
  },
  mapContainer: {
    flex: 0.7,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  infoContainer: {
    flex: 0.2,
    backgroundColor: "white",
    marginTop: -10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
  },
  infoText: {
    fontSize: 15,
    color: "black",
    fontWeight: "bold",
  },
});
