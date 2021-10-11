import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useState } from 'react'
import './i18n';
import { useTranslation } from 'react-i18next';

export function SelectionScreen({navigation}) {
    const { t, i18n } = useTranslation();
    const [mainScreen, setMainScreen] = useState(true);
 
    return(
        <View style={styles.container}>
            { mainScreen ? 
            <View style={{flex: 10}}>
                <View style={styles.headerContainer}>
                    <Text style={{fontSize: 28, fontWeight: 'bold', marginTop: 10}}>{t("Find various places")}</Text>
                    <Text style={{fontSize: 28, fontWeight: 'bold'}}>{t("closest to you")}</Text>
                </View>
                <View style={styles.menuContainer}>
                    <TouchableOpacity style={styles.buttonA} onPress={() => navigation.navigate('StationScreen')}>
                        <Text style={styles.insideButtonText}>{t("Filling stations")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonB}>
                        <Text style={styles.insideButtonText}>{t("Car repair")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonC}>
                        <Text style={styles.insideButtonText}>{t("Hospitals")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonD}>
                        <Text style={styles.insideButtonText}>{t("Pharmacies")}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonE}>
                        <Text style={styles.insideButtonText}>{t("Fast food")}</Text>
                    </TouchableOpacity>
                </View>
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
      backgroundColor: '#fff',
    },
    headerContainer: {
        flex: 0.8,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    menuContainer: {
        flex: 6,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonA: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#DAA520",
        borderRadius: 18,
        borderColor: '#009688',
        width: 256,
        height: 48,
        marginTop: 24,
      },
    buttonB: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "grey",
        borderRadius: 18,
        borderColor: '#009688',
        width: 256,
        height: 48,
        marginTop: 24,
      },
      buttonC: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#1E90FF",
        borderRadius: 18,
        borderColor: '#009688',
        width: 256,
        height: 48,
        marginTop: 24,
      },
      buttonD: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#2E8B57",
        borderRadius: 18,
        borderColor: '#009688',
        width: 256,
        height: 48,
        marginTop: 24,
      },
      buttonE: {
        alignItems: "center",
        justifyContent: 'center',
        backgroundColor: "#DC143C",
        borderRadius: 18,
        borderColor: "#009688",
        width: 256,
        height: 48,
        marginTop: 24,
      },
      insideButtonText: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
      },   
      insideButtonTextA: {
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
      },   
    bottomMenu: {
        flex: 0.53,
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
      }
})