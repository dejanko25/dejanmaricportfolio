import 'react-native-gesture-handler'; //npm install @react-navigation/native @react-navigation/stack & expo install react-native-reanimated react-native-gesture-handler react-native-screens react-native-safe-area-context @react-native-community/masked-view
import React from 'react';
import './i18n';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { SelectionScreen } from './SelectionScreen';
import { MainScreen } from './MainScreen';
import { MapScreen } from './MapScreen';
import { ListScreen } from './ListScreen';
const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="SelectionScreen">
        <Stack.Screen name="SelectionScreen" component={SelectionScreen}/>
        <Stack.Screen name="StationScreen" component={MainScreen}/>
        <Stack.Screen name="MapScreen" component={MapScreen}/>
        <Stack.Screen name="ListScreen" component={ListScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}