import React from 'react';
import { StyleSheet, Dimensions, Linking} from 'react-native';
import MapView, { Marker } from 'react-native-maps'; //expo install react-native-maps
import {topFiveStations, yourCoords} from './MainScreen';
import './i18n';
import { useTranslation } from 'react-i18next';

export function MapScreen() {

  const { t, i18n } = useTranslation();

    return (
        <MapView style={styles.map} 
        region={{
        latitude: yourCoords[0],
        longitude: yourCoords[1],
        latitudeDelta: 0.0150,
        longitudeDelta: 0.0150
        }}> 
        <Marker coordinate={{ latitude : topFiveStations[0][0].attributes.latitude, longitude: topFiveStations[0][0].attributes.longitude}} 
                title={topFiveStations[0][0].attributes.name} description={topFiveStations[0][1]+t("m away")}
                onCalloutPress={() => Linking.openURL("google.navigation:q="+topFiveStations[0][0].attributes.latitude+", "+topFiveStations[0][0].attributes.longitude)} /> 
        <Marker coordinate={{ latitude : topFiveStations[1][0].attributes.latitude, longitude: topFiveStations[1][0].attributes.longitude}} 
                title={topFiveStations[1][0].attributes.name} description={topFiveStations[1][1]+t("m away")}
                onCalloutPress={() => Linking.openURL("google.navigation:q="+topFiveStations[1][0].attributes.latitude+", "+topFiveStations[1][0].attributes.longitude)} />
        <Marker coordinate={{ latitude : topFiveStations[2][0].attributes.latitude, longitude: topFiveStations[2][0].attributes.longitude}} 
                title={topFiveStations[2][0].attributes.name} description={topFiveStations[2][1]+t("m away")}
                onCalloutPress={() => Linking.openURL("google.navigation:q="+topFiveStations[2][0].attributes.latitude+", "+topFiveStations[2][0].attributes.longitude)} />
        <Marker coordinate={{ latitude : topFiveStations[3][0].attributes.latitude, longitude: topFiveStations[3][0].attributes.longitude}} 
                title={topFiveStations[3][0].attributes.name} description={topFiveStations[3][1]+t("m away")}
                onCalloutPress={() => Linking.openURL("google.navigation:q="+topFiveStations[3][0].attributes.latitude+", "+topFiveStations[3][0].attributes.longitude)} />
        <Marker coordinate={{ latitude : topFiveStations[4][0].attributes.latitude, longitude: topFiveStations[4][0].attributes.longitude}} 
                title={topFiveStations[4][0].attributes.name} description={topFiveStations[4][1]+t("m away")}
                onCalloutPress={() => Linking.openURL("google.navigation:q="+topFiveStations[4][0].attributes.latitude+", "+topFiveStations[4][0].attributes.longitude)} />
        </MapView> 
    );
}   

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    map: {
      width: Dimensions.get('window').width,
      height: Dimensions.get('window').height,
    }
  })