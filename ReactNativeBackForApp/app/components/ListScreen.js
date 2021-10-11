import React from 'react';
import { StyleSheet, Image, View, Text, TouchableOpacity, Linking, KeyboardAvoidingView, TextInput, ScrollView} from 'react-native';
import { Overlay } from 'react-native-elements';
import { topFiveStations } from './MainScreen'
import { useState, useEffect } from 'react';
import './i18n';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage'; //npm install @react-native-async-storage/async-storage
//import DeviceInfo from 'react-native-device-info'; // THIS DOESNT WORK IN EXPO :(((, BUT SHOULD BE USED NORMALLY
import { Rating, AirbnbRating } from 'react-native-ratings';
const B = (props) => <Text style={{fontWeight: 'bold', fontSize: 13.4}}>{props.children}</Text>
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))

const Parse = require('parse/react-native');
Parse.setAsyncStorage(AsyncStorage);
Parse.serverURL = 'https://parseapi.back4app.com'; // This is your Server URL
Parse.initialize(
  '9Aakmt7oNAWi32RnxHGtJ3W5PqctzrdeBIF44l72', // This is your Application ID
  'nP5crUaj4mdpgqXZXZ4FXDoxNQnQi1MvBHdStTCk' // This is your Javascript key
);
const MyGasClass = Parse.Object.extend('gasStation');
const query = new Parse.Query(MyGasClass);
let allRatings = [];
let commentedStations = [];
let currentStationId; 
let currentStationName;
let currentStationRatings;
let currentStationCounter;
let iHaveClicked = false;

export function ListScreen() {
    const googleRoutePicDnB = require('../assets/googleRoutePicDnB.png');
    const googleRoutePicEle = require('../assets/googleRoutePicEle.png');
    let uniqueID = "MyMadeUpDeviceId"//DeviceInfo.getUniqueId();
    const [mainScreen, setMainScreen] = useState(true);
    const [wildTest, setWildTest] = useState(false);
    const { t, i18n } = useTranslation();
    const [readOverlayVis, setReadOverlay] = useState(false);

    useEffect(function() {
        (async () => {
          try {
            const temp = await AsyncStorage.getItem('@commentedStations');
            if (temp !== null) {
                commentedStations = JSON.parse(temp);
                console.log(commentedStations);
            }
            else console.log("Data retrieved but its null!");
          } catch(e) {
            console.log("Error acquiring data from local storage!!!");
            console.log(e);
          }
          })
        ();
      }, []);

    const StationList = (constants) => {
        return (
                <View style={styles.oneStationContainer}>
                    <View style={constants.DnB ? styles.oneStationNameDnB : styles.oneStationNameEle}>
                        <Text style={{fontWeight: 'bold', color: constants.DnB ? '#fff' : 'black', fontSize: 16}}>{constants.name}</Text>
                    </View>
                    <View style={styles.phoneAddrContainer}>
                        <View style={constants.DnB ? styles.oneStationDescriptionDnB : styles.oneStationDescriptionEle}>
                            <Text style={{color: constants.DnB ? '#fff' : 'black', marginLeft: 6, marginTop: -2, fontSize: 13}}><B>{t("Address")}:</B> {constants.address}</Text>
                            <Text style={{color: constants.DnB ? '#fff' : 'black', marginLeft: 6, marginTop: -2, fontSize: 13}}><B>{t("Phone")}:</B> {constants.phoneNumber}</Text> 
                            <Text style={{color: constants.DnB ? '#fff' : 'black', marginLeft: 6, marginTop: -2, fontSize: 13}}><B>{t("WC & shop")}:</B> {constants.timeInfo}</Text>
                        </View>
                        <View style={constants.DnB ? styles.oneStationDirectionsDnB : styles.oneStationDirectionsEle}>
                            <TouchableOpacity onPress={() => Linking.openURL("google.navigation:q="+constants.latitude+", "+constants.longitude)}>
                                <Image style={{resizeMode: 'contain', width: 40, height: 40}} source={constants.DnB ? googleRoutePicDnB : googleRoutePicEle}/>
                            </TouchableOpacity>
                            <Text style={{color: constants.DnB ? '#fff' : 'black'}}>{constants.distance}{t("m away")}</Text>                  
                        </View>
                        <View style={constants.DnB ? styles.oneStationRatingDnB : styles.oneStationRatingEle}>
                            <TouchableOpacity style={styles.viewRatingsTO} onPress={() => openRatingsOverlay(constants.ID)}>
                                <Text style={constants.DnB ? styles.viewRatingsTextDnB : styles.viewRatingsTextEle}>{t("View ratings")}</Text>
                            </TouchableOpacity>
                            {/* <TouchableOpacity style={styles.rateTextTO} onPress={() => readFromb4app()}>
                                <Text style={constants.DnB ? styles.rateTextDnB : styles.rateTextEle}>Rate</Text>
                            </TouchableOpacity> */}
                        </View>
                    </View>
                </View>
        )
    }
    
    function openRatingsOverlay(gasStationID) {
        allRatings.length = 0;
        currentStationId = gasStationID;
        iHaveClicked = false;
        setReadOverlay(true);
        for (var i=0; i < topFiveStations.length; i++){
            if (topFiveStations[i][0].id == gasStationID) {
                currentStationName = topFiveStations[i][0].attributes.name;
                currentStationCounter = i;
                if (topFiveStations[i][0].attributes.stationRatings.length !== 0) 
                {
                    for (var j=0; j < topFiveStations[i][0].attributes.stationRatings.length; j++) {
                        if (topFiveStations[i][0].attributes.stationRatings[j].userId == uniqueID)
                        allRatings.push(
                            <View style={{paddingBottom: 10}} key={topFiveStations[i][0].attributes.stationRatings[j].Id}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 18,}}>{topFiveStations[i][0].attributes.stationRatings[j].userName}</Text>
                                    <Rating style={{marginLeft: 10, marginTop:5}} startingValue={topFiveStations[i][0].attributes.stationRatings[j].userRating} readonly={true} imageSize={18}/>
                                        <TouchableOpacity onPress={() => deleteRating()}>
                                            <Text style={{fontStyle: 'italic', color: 'red', fontSize: 12, marginTop: 5, marginLeft: 15}}>{t("Delete rating")}</Text>
                                        </TouchableOpacity>
                                </View>
                                <Text style={{fontSize: 15}}>{topFiveStations[i][0].attributes.stationRatings[j].userComment}</Text>
                            </View>
                        )
                        else
                        allRatings.push(
                            <View style={{paddingBottom: 10}} key={topFiveStations[i][0].attributes.stationRatings[j].Id}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 18,}}>{topFiveStations[i][0].attributes.stationRatings[j].userName}</Text>
                                    <Rating style={{marginLeft: 10, marginTop:5}} startingValue={topFiveStations[i][0].attributes.stationRatings[j].userRating} readonly={true} imageSize={18}/>
                                </View>
                                <Text style={{fontSize: 15}}>{topFiveStations[i][0].attributes.stationRatings[j].userComment}</Text>
                            </View>
                        )
                    }
                }
            }
        }
    }
     
    const OverlayDisplayRatings = () => { 
        const [userName, setUserName] = useState("");
        const [userComment, setUserComment] = useState("");
        const [userRating, setUserRating] = useState("");
        let checker = false;
        let thisGetsDisplayed = [];
        thisGetsDisplayed.push(
            <View style={{flex:0.1, marginBottom: 10}} key='stationname'>
                <Text style={{textAlign: 'center', fontSize: 18, fontWeight: 'bold', borderColor: 'black', borderWidth:0.8}}>{currentStationName}</Text>
            </View>
        );
        if (allRatings.length == 0)
        thisGetsDisplayed.push(
            <View style={{flex:0.2}} key="noratings">
                <Text>{t("This filling station has no ratings yet, be the first one to rate")}!</Text>
            </View>
        ); 
        else 
        thisGetsDisplayed.push(allRatings);
        if (commentedStations.length == 0) { 
            thisGetsDisplayed.push(
                <View style={{flex:1, justifyContent: 'flex-end'}} key="input">
                    <Text style={{textAlign:'center'}}>{t("Write a review")}!</Text>
                    <Text>{t("Name")}:</Text>
                    <TextInput style={{ height: 32, borderColor: 'gray', borderWidth: 0.8 }} value={userName} onChangeText={text => setUserName(text)}/>
                    <Text>{t("Comment")}:</Text>
                    <TextInput style={{ height: 32, borderColor: 'gray', borderWidth: 0.8 }} value={userComment} onChangeText={text => setUserComment(text)}/>
                    <AirbnbRating style={{ paddingTop: 4, paddingBottom: 10}} reviewSize={20} size={20} onFinishRating={(rating) => setUserRating(rating)}/>
                    <TouchableOpacity style={styles.button} onPress={() => submitRating(userName, userComment, userRating)}> 
                        <Text style={{textAlign: 'center'}}>{t("Submit")}</Text>
                    </TouchableOpacity>
                </View> 
            );
        }
        else {
            for (var i = 0; i < commentedStations.length; i++) {
                if (commentedStations[i] == currentStationId) {
                    checker = true;
                    if (allRatings.length < 3)
                    thisGetsDisplayed.push(
                            <View style={{flex:1, justifyContent: 'flex-end'}} key="ucommented">
                                <Text style={{textAlign: 'center'}}>{t("You have already rated this station")}.</Text>
                            </View>
                        );
                    else
                        thisGetsDisplayed.push(
                            <View style={{marginTop: 90}} key="ucommented">
                                    <Text style={{textAlign: 'center'}}>{t("You have already rated this station")}.</Text>
                            </View>
                        );
                }
            }
            if (!checker)
            thisGetsDisplayed.push(
                <View style={{flex:1, justifyContent: 'flex-end', marginTop: 10}} key="input">
                    <Text style={{textAlign:'center'}}>{t("Write a review")}!</Text>
                    <Text>{t("Name")}:</Text>
                    <TextInput style={{ height: 32, borderColor: 'gray', borderWidth: 0.8 }} value={userName} onChangeText={text => setUserName(text)}/>
                    <Text>{t("Comment")}:</Text>
                    <TextInput style={{ height: 32, borderColor: 'gray', borderWidth: 0.8 }} value={userComment} onChangeText={text => setUserComment(text)}/>
                    <AirbnbRating style={{ paddingTop: 4, paddingBottom: 10}} reviewSize={20} size={20} onFinishRating={(rating) => setUserRating(rating)}/>
                    <TouchableOpacity style={styles.button} onPress={() => submitRating(userName, userComment, userRating)}> 
                        <Text style={{textAlign: 'center'}}>{t("Submit")}</Text>
                    </TouchableOpacity>
                </View> 
            );
        }
        if (allRatings.length < 3)
        return (
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
            <ScrollView contentContainerStyle={{flex: 1}}>
                {thisGetsDisplayed}
            </ScrollView> 
            </KeyboardAvoidingView>
        );
        else 
        return (
            <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{flex:1}}>
                <ScrollView style={{flex:1}}>
                    {thisGetsDisplayed}
                </ScrollView>
            </KeyboardAvoidingView>
        )
    }

    function submitRating(userName, userComment, userRating) {
        if (userName == '' || userComment == '' || userRating == '') { alert("Please fill every input before submitting a rating"); return;}
        if (!iHaveClicked) {
            iHaveClicked = true;
        for (var i=0; i < topFiveStations.length; i++){
            if (topFiveStations[i][0].id == currentStationId) {
                if (topFiveStations[i][0].attributes.stationRatings.length == 0) {
                    topFiveStations[i][0].attributes.stationRatings.push({
                        "Id": 0,
                        "userId": uniqueID,
                        "userName": userName,
                        "userRating": userRating,
                        "userComment": userComment
                    });
                }
                else {
                topFiveStations[i][0].attributes.stationRatings.push({
                    "Id": Number(topFiveStations[i][0].attributes.stationRatings[topFiveStations[i][0].attributes.stationRatings.length-1].Id)+1,
                    "userId": uniqueID,
                    "userName": userName,
                    "userRating": userRating,
                    "userComment": userComment
                });
                }
                currentStationRatings = topFiveStations[i][0].attributes.stationRatings;
                commentedStations.push(currentStationId);
                alert(t("Your review was saved successfully."));
                openRatingsOverlay(currentStationId);
                setWildTest(!wildTest);
                console.log("About to update b4app");
                updateB4App();
            }
        }
        }
    }

    function deleteRating() {
        for (var i = topFiveStations[currentStationCounter][0].attributes.stationRatings.length - 1; i >= 0; --i) {
            if (topFiveStations[currentStationCounter][0].attributes.stationRatings[i].userId == uniqueID) {
                topFiveStations[currentStationCounter][0].attributes.stationRatings.splice(i, 1);
                return;
            }
        }
        currentStationRatings = topFiveStations[currentStationCounter][0].attributes.stationRatings;
        if (commentedStations.indexOf(currentStationId) !== -1)
            commentedStations.splice(commentedStations.indexOf(currentStationId), 1);
        alert(t("Your review was deleted successfully."));
        openRatingsOverlay(currentStationId);
        setWildTest(!wildTest);
        console.log("About to update b4app");
        updateB4App();
    }

    function updateB4App() {
        query.get(currentStationId).then( (object) => {
            object.set('stationRatings', currentStationRatings);
            object.save().then((response) => {
                console.log('Updated gasStation', response);
                console.log("About to update local storage");
                updateLocalStorage();
               // currentStationId = null;                          REMINDER
               // currentStationRatings = null;                     REMINDER
            }, (error) => {
                console.log("Error while updating gasStation", error);
            });
        });
    }

    async function updateLocalStorage() {
        await sleep(5000);
        try {
            console.log(commentedStations);
            await AsyncStorage.setItem('@commentedStations', JSON.stringify(commentedStations));
            console.log("Local storage was updated successfully");
        }
        catch(e) {
            console.log("There was an error updating local storage!");
        }
    }

    function closeOverlay() {
        setReadOverlay(false);
        currentStationId = null;
        currentStationName = null;
        currentStationRatings = null;
        currentStationCounter = null;
    }

    return ( 
        <View style={styles.container}>
            <Overlay overlayStyle={styles.OverlayContainer} isVisible={readOverlayVis} onBackdropPress={() => closeOverlay()}>
                    <OverlayDisplayRatings />
            </Overlay>
             {mainScreen ? 
            <View style={{flex:10}}>
                <StationList name = {topFiveStations[0][0].attributes.name} distance = {topFiveStations[0][1]} address = {topFiveStations[0][0].attributes.Address} phoneNumber = {topFiveStations[0][0].attributes.phoneNumber} timeInfo = {topFiveStations[0][0].attributes.openingHours} DnB = {topFiveStations[0][0].attributes.DnB} latitude = {topFiveStations[0][0].attributes.latitude} longitude = {topFiveStations[0][0].attributes.longitude} ID = {topFiveStations[0][0].id}/>
                <StationList name = {topFiveStations[1][0].attributes.name} distance = {topFiveStations[1][1]} address = {topFiveStations[1][0].attributes.Address} phoneNumber = {topFiveStations[1][0].attributes.phoneNumber} timeInfo = {topFiveStations[1][0].attributes.openingHours} DnB = {topFiveStations[1][0].attributes.DnB} latitude = {topFiveStations[1][0].attributes.latitude} longitude = {topFiveStations[1][0].attributes.longitude} ID = {topFiveStations[1][0].id}/>
                <StationList name = {topFiveStations[2][0].attributes.name} distance = {topFiveStations[2][1]} address = {topFiveStations[2][0].attributes.Address} phoneNumber = {topFiveStations[2][0].attributes.phoneNumber} timeInfo = {topFiveStations[2][0].attributes.openingHours} DnB = {topFiveStations[2][0].attributes.DnB} latitude = {topFiveStations[2][0].attributes.latitude} longitude = {topFiveStations[2][0].attributes.longitude} ID = {topFiveStations[2][0].id}/>
                <StationList name = {topFiveStations[3][0].attributes.name} distance = {topFiveStations[3][1]} address = {topFiveStations[3][0].attributes.Address} phoneNumber = {topFiveStations[3][0].attributes.phoneNumber} timeInfo = {topFiveStations[3][0].attributes.openingHours} DnB = {topFiveStations[3][0].attributes.DnB} latitude = {topFiveStations[3][0].attributes.latitude} longitude = {topFiveStations[3][0].attributes.longitude} ID = {topFiveStations[3][0].id}/>
                <StationList name = {topFiveStations[4][0].attributes.name} distance = {topFiveStations[4][1]} address = {topFiveStations[4][0].attributes.Address} phoneNumber = {topFiveStations[4][0].attributes.phoneNumber} timeInfo = {topFiveStations[4][0].attributes.openingHours} DnB = {topFiveStations[4][0].attributes.DnB} latitude = {topFiveStations[4][0].attributes.latitude} longitude = {topFiveStations[4][0].attributes.longitude} ID = {topFiveStations[4][0].id}/>
            </View>
            :
            <View style={styles.info}>
                <Text style={{textAlign: 'center', fontSize: 16, marginLeft: 3, marginRight: 3}}>{t("This application was designed with the intention to help people quickly find various essential places in their area, such as hospitals or filling stations.")} </Text>
                <Text style={{textAlign: 'center', fontSize: 16, marginTop: 16, marginLeft: 3, marginRight: 3 }}>{t("If you found a bug or want to improve something message me at dejanko25@gmail.com")}</Text>
            </View>
            }
            <View style={styles.bottomMenu}>
                <TouchableOpacity style={styles.bottomMenuTO}onPress={() => setMainScreen(!mainScreen)} disabled={mainScreen}>
                    <Text style={{color: '#fff'}}>{t("Finder")}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.bottomMenuTO} onPress={() => setMainScreen(!mainScreen)} disabled={!mainScreen}>
                    <Text style={{color: '#fff'}}>Info</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#fff",
    },
    oneStationContainer: {
        flex: 1,
        borderRightWidth: 1.76,
        borderLeftWidth: 1.76,
        borderTopWidth: 0.88,
        borderBottomWidth: 0.88,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderColor: '#fff'
    },
    oneStationNameDnB: {
        flex: 0.38,
        backgroundColor: "#A52A2A",//"#009688",
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderColor: '#fff',
    },
    oneStationNameEle: {
        flex: 0.38,
       // backgroundColor: "#009688",
        backgroundColor: "#90EE90",//"#00FA9A",
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        borderColor: '#fff',
    },
    phoneAddrContainer: {
        flex: 1.1,
        flexDirection: 'row',
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        borderColor: '#fff'
    },
    oneStationDescriptionDnB: {
        flex: 1.8,
        backgroundColor: "#A52A2A",//"#009688",
        borderBottomLeftRadius: 16,
        borderColor: '#fff',
        justifyContent: 'center',
    },
    oneStationDescriptionEle: {
        flex: 1.8,
        backgroundColor: "#90EE90",//"#00FA9A",
        borderBottomLeftRadius: 16,
        borderColor: '#fff',
        justifyContent: 'center',
    },
    oneStationDirectionsDnB: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: "#A52A2A",//"#009688",
    },
    oneStationDirectionsEle: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start',
        backgroundColor: "#90EE90",//"#00FA9A",
    },
    bottomMenu: {
        flex: 0.55,
        flexDirection: 'row',
       // backgroundColor: 'orange',
      //  borderWidth: 2,
      //  borderRadius: 4,
      //  borderColor: "#009688",
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
    },
    OverlayContainer: {
        width: 300,
        height: 420,
        position: 'absolute',
    },
    oneStationRatingDnB: {
        flex: 0.5,
        backgroundColor: "#A52A2A",//"#009688",
        borderColor: '#fff',
        borderBottomRightRadius: 16,
        justifyContent: 'center',
        alignItems: 'center'
    },
    oneStationRatingEle: {
        flex: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: "#90EE90",//"#00FA9A",
        borderBottomRightRadius: 16,
        borderColor: '#fff',
        textAlign: 'center',
    },
    viewRatingsTextDnB: {
        textAlign:'center', 
        color: '#fff',
    },
    viewRatingsTextEle: {
        textAlign:'center', 
        color: 'black',
    },
    rateTextDnB: {
        color:'#fff',
    },
    rateTextEle: {
        color:'black',
    },
    viewRatingsTO: { 
       marginTop: -22,
       marginRight: 10,
    },
    rateTextTO: {
        marginBottom: -10, 
        marginTop: 5,
        marginRight: 10,
    },
    button: {
        alignItems: "center",
        elevation: 8,
        backgroundColor: "#009688",
        borderRadius: 10,
        borderColor: '#009688',
        paddingVertical: 5,
        paddingHorizontal: 12,
        marginLeft: 80,
        maxWidth: 120,
        maxHeight: 40,
      },
  })