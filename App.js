import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, RefreshControl, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import InAppNotification from './InAppNotification';
import ActionSheet from './ActionSheet';
import { SheetManager } from "react-native-actions-sheet";
import * as Font from 'expo-font';
import Constants from "expo-constants";
import EventEmitter from "react-native-eventemitter";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';

TaskManager.defineTask('update-car-floor', async () => {
  const floor = await AsyncStorage.getItem('@car-floor');
  if (floor) {
    await fetch(
      Constants.manifest.extra.apiGatewayInvokeUrl,
      { 
        method: 'PUT', 
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': Constants.manifest.extra.apiGatewayAuthorization
        },
        body: floor
      }
    )
    .then(resp => {
      if (resp.ok) return resp.json();
      throw new Error("PUT BACKGROUND request failed")
    })
    .then(async () => {
      console.log("PUT BACKGROUND request succeeded! Removing previously scheduled background task.")
      await AsyncStorage.setItem('@car-floor', '')
    })
    .catch(err => console.log(err));
  }
});

export default function App() {
  const [refreshing, setRefreshing] = useState(false);
  const [showNotification, setShowNotification] = useState(true);
  const [notificationConfig, setNotificationConfig] = useState({
    boldText: 'Hang Tight!',
    regularText: 'Fetching up to date car floor.',
    progressTime: Infinity,
    animateIn: false
  });
  const [parkingFloor, setParkingFloor] = useState('－');
  const [lastParked, setLastParked] = useState('－');
  const [fontsLoaded, setFontsLoaded ] = useState(false);

  useEffect(() => {
    TaskManager.isTaskRegisteredAsync('update-car-floor').then((isRegistered) => {
      if (!isRegistered) {
        BackgroundFetch.registerTaskAsync('update-car-floor', { minimumInterval: 5 });
      }
    });
    loadFontsAsync(setFontsLoaded);
    loadParkingFloor(showNotification, setParkingFloor, setLastParked, setShowNotification, setNotificationConfig);
  }, []);

  return (
    fontsLoaded 
      ? <ScrollView 
          style={styles.fullScreenScrollViewTop}
          contentContainerStyle={styles.fullScreenScrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh(showNotification, setParkingFloor, setLastParked, setShowNotification, setNotificationConfig, setRefreshing)}
            ></RefreshControl>
          }
        >
      { showNotification 
        ? <InAppNotification
            boldText={notificationConfig.boldText}
            regularText={notificationConfig.regularText}
            progressTime={notificationConfig.progressTime}
            cancelCallback={notificationDestroyed(setShowNotification)}
            animateIn={notificationConfig.animateIn}
            key={notificationConfig.date}
          ></InAppNotification>
        : <></>
      }

      <Text style={styles.title}>THE CAR IS ON</Text>
      <Text style={styles.location}>{parkingFloor}</Text>
      <Text style={styles.timestamp}>
        <Text style={styles.timestampText}>Last parked </Text>
        <Text style={styles.timestampValue}>{lastParked}</Text>
      </Text>

      <View style={styles.buttonCollectionView}>
        <Pressable 
          style={({ pressed }) => [
            pressed ? { opacity: 0.8 } : {},
            styles.buttonPrimaryPressableStyle
          ]} 
          onPress={ () => SheetManager.show('bottom-action-sheet') }
        >
          <View style={ styles.buttonPrimaryView }>
            <FontAwesome name="car" size={24} color="#fff" />
          </View>
          <Text style={ styles.buttonPrimaryTextStyle }>PARK CAR</Text>
        </Pressable>
      </View>
      <ActionSheet 
        click={ updateParkingFloor(showNotification, setParkingFloor, setLastParked, setShowNotification, setNotificationConfig, setRefreshing) }
      ></ActionSheet>
    </ScrollView>
    : <></>
  );
}


export async function loadFontsAsync(setFontsLoaded) {
  await Font.loadAsync({
    'Inter-Black': require('./assets/fonts/Inter-Black.ttf'),
    'Inter-Extra-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    'Inter-SemiBold': require('./assets/fonts/Inter-SemiBold.ttf'),
    'Inter-Medium': require('./assets/fonts/Inter-Medium.ttf'),
    'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
    'Inter-Light': require('./assets/fonts/Inter-Light.ttf'),
    'Inter-Extra-Light': require('./assets/fonts/Inter-ExtraLight.ttf')
  });
  setFontsLoaded(true);
}

export async function loadParkingFloor(
  showNotification,
  setParkingFloor, 
  setLastParked,
  setShowNotification, 
  setNotificationConfig,
) {
  return fetch(
    Constants.manifest.extra.apiGatewayInvokeUrl,
    { headers: { Authorization: Constants.manifest.extra.apiGatewayAuthorization }}
  )
  .then(resp => { 
    if (resp.ok) return resp.json();
    throw new Error("GET request unsuccessful");
  })
  .then(json => {
    setParkingFloor(json.floor);
    setLastParked(json.lastParked);
    showNewNotification(showNotification, setShowNotification, setNotificationConfig, {
      boldText: 'Success!',
      regularText: 'Fetched most up to date car location.',
      progressTime: 5000
    });
    return json;
  })
  .catch(() => showNewNotification(showNotification, setShowNotification, setNotificationConfig, {
    boldText: 'Uh oh!',
    regularText: 'Could not get most up to date car floor. Try again with better internet connection.',
    progressTime: 5000
  }));
}

export function updateParkingFloor(
  showNotification,
  setParkingFloor,
  setLastParked,
  setShowNotification,
  setNotificationConfig
) {
  return (floor) => async () => {
    await SheetManager.hide("bottom-action-sheet");
    await fetch(
      Constants.manifest.extra.apiGatewayInvokeUrl,
      { 
        method: 'PUT', 
        headers: {
          'Content-Type': 'text/plain',
          'Authorization': Constants.manifest.extra.apiGatewayAuthorization
        },
        body: floor
      }
    ).then((resp) => {
      if (resp.ok) return resp.json();
      throw new Error("PUT request failed");
    })
    .then(async () => {
      await AsyncStorage.setItem('@car-floor', '')
      setParkingFloor(floor);
      setLastParked("now");
      showNewNotification(showNotification,setShowNotification, setNotificationConfig, {
        boldText: "Success!",
        regularText: "Car floor successfully updated.",
        progressTime: 5000
      });
    })
    .catch(async () => {
      await AsyncStorage.setItem('@car-floor', floor)
      showNewNotification(showNotification, setShowNotification, setNotificationConfig, {
        boldText: 'Uh oh!',
        regularText: `Could not update car floor. Will automatically try to park on ${floor} when internet is restored.`,
        progressTime: 5000
      });
    });
  }
}

export function notificationDestroyed(setShowNotification) {
  return () => setShowNotification(false);
}

export function showNewNotification(
  showNotification,
  setShowNotification, 
  setNotificationConfig, 
  config
) {
  EventEmitter.emit('blur-notification');
  setTimeout(() => {
    setNotificationConfig(config);
    setShowNotification(true);
  }, showNotification ? 1000 : 600)
}

export function onRefresh(
  showNotification, 
  setParkingFloor, 
  setLastParked, 
  setShowNotification, 
  setNotificationConfig, 
  setRefreshing
) {
  return () => {
    setRefreshing(true);
    loadParkingFloor(showNotification, setParkingFloor, setLastParked, setShowNotification, setNotificationConfig, setRefreshing)
      .then(() => setRefreshing(false))
  };
}

const styles = StyleSheet.create({
  touchableOpacityStyle: {
    textAlign: 'center',
    borderRadius: 10
  },
  buttonCollectionView: {
    position: 'absolute',
    bottom: 106,
  },
  buttonPrimaryView: {
    marginRight: 12
  },
  buttonPrimaryPressableStyle: {
    backgroundColor: '#3a6ea6',
    width: 250,
    borderRadius: 10,
    paddingVertical: 15,
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  buttonPrimaryTextStyle:  {
    color: '#ffffff',
    fontSize: 20,
    fontFamily: 'Inter-Regular',
    letterSpacing: 2,
  },
  fullScreenScrollView: {
    flex: 1,
    backgroundColor: '#D2E0EF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  fullScreenScrollViewTop: {
    backgroundColor: '#D2E0EF',
  },
  inAppNotificationContainer: {
    position: 'absolute',
    top: 106,
    width: '85%'
  },
  title: {
    fontSize: 20,
    letterSpacing: 2,
    fontFamily: 'Inter-Regular'
  },
  location: {
    fontSize: 100,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    fontFamily: 'Inter-SemiBold'
  },
  secondaryButtonClickableText: {
    fontFamily: 'Inter-SemiBold',
    color: '#3a6ea6',
    fontSize: 16
  },
  secondaryButtonUnclickableText: {
    fontFamily: 'Inter-Regular',
    fontSize: 16
  },
  secondaryButtonView: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  timestampText: {
    fontSize: 20,
    fontFamily: 'Inter-Extra-Light'
  },
  timestampValue: {
    fontFamily: 'Inter-Medium',
    fontSize: 24
  },
});
