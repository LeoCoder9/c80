import React from "react";
import { View, Text, FlatList, SafeAreaView, Platform, StatusBar,ImageBackground, Image, Dimensions, StyleSheet } from "react-native";
import axios from "axios";


export default class Meteor extends React.Component {
  constructor() {
    super();
    this.state = {
      meteors: {},
    };
  }
  componentDidMount() {
    this.getMeteors();
  }
  getMeteors = () => {
    axios
      .get(
        "https://api.nasa.gov/neo/rest/v1/feed?start_date=2022-03-21&end_date=2022-03-27&api_key=wi0DvkdQmY0BtAtmQb5Xh0Y59ZhZhSGeQdqbOMeg"
      )
      .then((response) => {
        this.setState({ meteors: response.data.near_earth_objects });
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  
  keyExtractor = (item, index) => index.toString()
  renderItem = ({item}) => {
    var bgim 
    var size 
    var speed
    if(item.threat_score <= 30){
      bgim = require("../assets/meteor_bg1.png")
      speed = require("../assets/meteor_speed1.gif")
      size = 100
    }else if(item.threat_score <= 75){
      bgim = require("../assets/meteor_bg2.png")
      speed = require("../assets/meteor_speed2.gif")
      size = 150
    }else {
      bgim = require("../assets/meteor_bg3.png")
      speed = require("../assets/meteor_speed3.gif")
      size = 200
    }
    return(
      <View>
        <ImageBackground source={bgim} style = {styles.backgroundImage} >
        <View style = {styles.gifContainer}>
          <Image source={speed} style = {{width: size, height: size, alignSelf: "center"}}></Image>
          <View>
            <Text style = {[styles.cardTitle,{marginTop:400, marginLeft:50}]}>{item.name}</Text>
            <Text style = {[styles.cardText,{marginTop:20, marginLeft:50}]}> closest to earth - {item.close_approach_data[0].close_approach_date_full}</Text>
            <Text style = {[styles.cardText,{marginTop:20, marginLeft:50}]}> minimum diameter(kilometers) - {item.estimated_diameter.kilometers.estimated_diameter_min}</Text>
            <Text style = {[styles.cardText,{marginTop:20, marginLeft:50}]}> maximum diameter(kilometers) - {item.estimated_diameter.kilometers.estimated_diameter_max}</Text>
            <Text style = {[styles.cardText,{marginTop:20, marginLeft:50}]}> velocity(km/h) - {item.close_approach_data[0].relative_velocity.kilometers_per_hour}</Text>
            <Text style = {[styles.cardText,{marginTop:20, marginLeft:50}]}> missing earth by - {item.close_approach_data[0].miss_distance.kilometers}</Text>
          </View>
        </View>
        </ImageBackground>
      </View>
    )
  }
  render() {
    if (Object.keys(this.state.meteors).length === 0) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Loading...</Text>
        </View>
      );
    } else {
      var meteor_Arr = Object.keys(this.state.meteors).map((meteor_date) => {
        // console.log(this.state.meteors[meteor_date]);

        return this.state.meteors[meteor_date];
      });

      var meteors = [].concat.apply([], meteor_Arr);
      //console.log(meteors);

      meteors.forEach(function (element) {
        let diameter =
          (element.estimated_diameter.kilometers.estimated_diameter_min +
            element.estimated_diameter.kilometers.estimated_diameter_max) /
          2;

        //threat_score = diameter/distance by which the meteor misses Earth
        let threatScore =
          (diameter / element.close_approach_data[0].miss_distance.kilometers) *
          1000000000;
        element.threat_score = threatScore;

        meteors.sort(function(a,b){
          return b.threat_score - a.threat_score
        })
        meteors = meteors.slice(0, 5)

        //console.log(threatScore);
      });
      return (
        <View style = {styles.container}>
           <SafeAreaView style = {styles.andriodStyle}></SafeAreaView>
           <FlatList keyExtractor={this.keyExtractor} data = {meteors} renderItem = {this.renderItem} horizontal = {true}></FlatList>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  andriodStyle: {
    marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height,
  },
  titleBar: {
    flex: 0.15,
    justifyContent: "center",
    alignItems: "center",
  },
  titleText: {
    fontSize: 30,
    fontWeight: "bold",
    color: "white",
  },
  meteorContainer: {
    flex: 0.85,
  },
  listContainer: {
    backgroundColor: "rgba(52, 52, 52, 0.5)",
    justifyContent: "center",
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    borderRadius: 10,
    padding: 10,
  },
  cardTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
    color: "white",
  },
  cardText: {
    color: "white",
  },
  threatDetector: {
    height: 10,
    marginBottom: 10,
  },
  gifContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  meteorDataContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
