import React from 'react';
import { useState, useEffect } from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity, Alert} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import './i18n';
import { useTranslation } from 'react-i18next';
import { getDistance } from 'geolib';
import * as Location from 'expo-location'; //expo install expo-location
import AsyncStorage from '@react-native-async-storage/async-storage';
export let topFiveStations = [];
export let yourCoords = [];

//const { AsyncStorage } = require('react-native');
const Parse = require('parse/react-native');
Parse.setAsyncStorage(AsyncStorage);
Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
Parse.initialize(
  '9Aakmt7oNAWi32RnxHGtJ3W5PqctzrdeBIF44l72', // This is your Application ID
  'nP5crUaj4mdpgqXZXZ4FXDoxNQnQi1MvBHdStTCk' // This is your Javascript key
);

const MyGasClass = Parse.Object.extend('gasStation');
const query = new Parse.Query(MyGasClass);
let allResults = [];
query.find().then(results => {
  if (typeof document !== 'undefined') document.write(`ParseObjects found: ${JSON.stringify(results)}`); 
  allResults = results.slice();
});

const DnBPic = require('../assets/DnBLogo.png');
const ElePic = require('../assets/EleLogo.png');
const resetSearchPic = require('../assets/ResetSearchPic.png');

export function MainScreen({ navigation }) {
  const { t, i18n } = useTranslation();
  const [location, setLocation] = useState(null);
  const [dnbBool, setDnB] = useState(false);
  const [elecBool, setElec] = useState(false);
  const [checkBox, setCheckBox] = useState(false);
  const [acquiredTop, setAcquired] = useState(false);
  const [mainScreen, setMainScreen] = useState(true);

  // Acquire users location and save it. Runs once every time you load this screen 
  useEffect(function() {
    if (topFiveStations.length == 0) setAcquired(false);
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      let location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest}); // Get location of my phone
        setLocation(location);
        yourCoords.length = 0;                                                                      // Save it to const location
        yourCoords.push(location.coords.latitude);
        yourCoords.push(location.coords.longitude);
      })
    ();
  }, []); 

  // Fill an array with 5 distance-wise closest stations according to the 3 bools passed  
  function closestFive(DnB, Electro, Food) { 
    topFiveStations.length = 0;
   allResults.forEach(gasStation => {
     let temporaryDistance = getDistance( {latitude: gasStation.attributes.latitude, longitude: gasStation.attributes.longitude}, 
                  {latitude: location.coords.latitude, longitude: location.coords.longitude} );
    if (Food) {
      if (gasStation.attributes.WCnFood) { 
        if (DnB && Electro)
        topFiveStations.push([gasStation, temporaryDistance]);
        else if (DnB) {
          if (gasStation.attributes.DnB)
          topFiveStations.push([gasStation, temporaryDistance]);
        }
        else if (Electro) {
          if (gasStation.attributes.Electricity)
          topFiveStations.push([gasStation, temporaryDistance]);
        }
      }
    }
    else {
      if (DnB && Electro)
        topFiveStations.push([gasStation, temporaryDistance]);
      else if (DnB) {
          if (gasStation.attributes.DnB)
            topFiveStations.push([gasStation, temporaryDistance]);
        }
      else if (Electro) {
          if (gasStation.attributes.Electricity)
            topFiveStations.push([gasStation, temporaryDistance]);
        }
    }
    });
    if (topFiveStations.length == 0) {
      alert(t("You must select at least 1 type of fuel"));
      return;
    }
    topFiveStations.sort(function(a,b){return a[1]-b[1]}); // sort the array ascending by temporaryDistance
    topFiveStations.splice(5);                             // we only want to see top 5 closest
    setAcquired(true);
  }

  // Reset the searching categories
  function resetSearch() {
    topFiveStations.length = 0;
    setAcquired(false);
    setCheckBox(false);
    setDnB(false);
    setElec(false);
  }

    return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerFont}>{t("Filling stations")}</Text>
      </View>
      {mainScreen ? <View style={{flex:10}}>
      <View style={styles.fuelTypeContainer}>
        <TouchableOpacity style={dnbBool ? styles.fuelTypeButtonAPressed : styles.fuelTypeButtonA} onPress={() => setDnB(!dnbBool)}>
          <Image style={styles.fuelTypePic} source={DnBPic}/>
          <Text style={{color: "#fff"}}>{t("Diesel & Petrol")}</Text>
          </TouchableOpacity>
      </View>
      <View style={styles.fuelTypeContainer}>
        <TouchableOpacity style={elecBool ? styles.fuelTypeButtonBPressed : styles.fuelTypeButtonB} onPress={() => setElec(!elecBool)}>
          <Image style={styles.fuelTypePic} source={ElePic}/>
          <Text style={{color: 'black'}}>{t("Charging stations")}</Text>
        </TouchableOpacity> 
      </View>
      <View style={styles.checkBoxStyle}>
        <CheckBox value={checkBox} onValueChange={(newValue) => setCheckBox(newValue)}/>
        <Text style={{marginTop: 5}}>{t("Station must have WC & shop")}</Text>
      </View>
      { acquiredTop ?
      <View style={styles.showScreens}>
        <TouchableOpacity style={styles.buttonSmoll} onPress={() => navigation.navigate('ListScreen')}>
          <Text style={styles.insideButtonText}>{t("View a list")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSmoll} onPress={() => navigation.navigate('MapScreen') }>
          <Text style={styles.insideButtonText}>{t("Check on map")}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => resetSearch()}>
          <Image style={{resizeMode: 'contain', width: 30, height: 30}} source={resetSearchPic}/>
        </TouchableOpacity>
      </View>
      :
      <View style={styles.findClosest}>
        <TouchableOpacity style={styles.button} onPress={() => closestFive(dnbBool, elecBool, checkBox)}>
          <Text style={styles.insideButtonText}>{t("Find 5 nearest stations")}</Text>
        </TouchableOpacity>
      </View>
      }
       </View> :  
        <View style={styles.info}>
          <Text style={{textAlign: 'center', fontSize: 16, marginLeft: 3, marginRight: 3}}>{t("This application was designed with the intention to help people quickly find various essential places in their area, such as hospitals or filling stations.")} </Text>
          <Text style={{textAlign: 'center', fontSize: 16, marginTop: 16, marginLeft: 3, marginRight: 3 }}>{t("If you found a bug or want to improve something message me at dejanko25@gmail.com")}</Text>
        </View>
      } 
      <View style={styles.bottomMenu}>
        <TouchableOpacity style={styles.bottomMenuTO}onPress={() => setMainScreen(!mainScreen)} disabled={mainScreen}>
          <Text style={styles.insideButtonText}>{t("Finder")}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bottomMenuTO} onPress={() => setMainScreen(!mainScreen)} disabled={!mainScreen}>
          <Text style={styles.insideButtonText}>Info</Text>
        </TouchableOpacity>
      </View>
    </View> 
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerContainer: {
      flex:1.3,
    },
    headerFont: {
      fontSize: 24, 
      fontWeight: 'bold',
      marginTop: 6,
    },
    fuelTypeContainer: {
      flex:2.1,
      alignItems: 'center',
    },
    fuelTypePic: {
      width: 80,
      height: 80,
      resizeMode: 'contain',
    },
    fuelTypeButtonA: {
      alignItems: "center",
      backgroundColor: "#A52A2A",
      borderWidth: 1.8,
      borderRadius: 10,
      borderColor: '#fff',
      width: 120,
      paddingBottom: 10,
      paddingTop: 8,
    },
      fuelTypeButtonB: {
      alignItems: "center",
      backgroundColor: "#90EE90",
      borderWidth: 1.8,
      borderRadius: 10,
      borderColor: '#fff',
      width: 120,
      paddingBottom: 10,
      paddingTop: 8,
    },
    fuelTypeButtonAPressed: {
      alignItems: "center",
      elevation: 8,
      backgroundColor: "#A52A2A",
      borderTopWidth: 1.8,
      borderRightWidth: 1.8,
      borderLeftWidth: 2,
      borderBottomWidth: 2,
      borderRadius: 10, 
      borderColor: "#009688",
      // borderTopColor: 'red',
      // borderLeftColor: 'darkorange',
      // borderBottomColor: 'darkorange',
      // borderRightColor: 'red',
      //paddingVertical: 10,
      //paddingHorizontal: 12
      width: 120,
      paddingBottom: 10,
      paddingTop: 8,
    },
    fuelTypeButtonBPressed: {
      alignItems: "center",
      elevation: 8,
      backgroundColor: "#90EE90",
      borderTopWidth: 1.8,
      borderRightWidth: 1.8,
      borderLeftWidth: 2,
      borderBottomWidth: 2,
      borderRadius: 10, 
      borderColor: "#009688",
      // borderTopColor: 'red',
      // borderLeftColor: 'darkorange',
      // borderBottomColor: 'darkorange',
      // borderRightColor: 'red',
      //paddingVertical: 10,
      //paddingHorizontal: 12
      width: 120,
      paddingBottom: 10,
      paddingTop: 8,
    },
    insideButtonText: {
      color: '#fff',
    },
    checkBoxStyle: {
      flex:0.7, 
      flexDirection: 'row',
      justifyContent: 'center',
      alignContent: 'center',
      alignItems: 'flex-start',
    },
    findClosest: {
      flex: 1.8,
      justifyContent: 'center',
    },
    showScreens: {
      flex: 1.8,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center'
    },
    button: {
      alignItems: "center",
      elevation: 8,
      backgroundColor: "#009688",
      borderRadius: 10,
      borderColor: '#009688',
      paddingVertical: 5,
      paddingHorizontal: 12,
      marginLeft: 5,
      marginRight: 5,
    },
    buttonSmoll: {
      alignItems: "center",
      elevation: 8,
      backgroundColor: "#009688",
      borderRadius: 10,
      borderColor: '#009688',
      width: 140,
      paddingVertical: 5,
      paddingHorizontal: 8,
      marginLeft: 5,
      marginRight: 5,
    },
    bottomMenu: {
      flex: 0.6,
      flexDirection: 'row',
    },
    bottomMenuTO: { 
      flex: 1,
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: "#009688",
      borderWidth: 2, 
      borderRadius: 2,
      borderColor: '#fff',
    },
    info: {
      flex: 10,
      justifyContent: 'center',
  }
  })