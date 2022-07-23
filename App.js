import { useEffect, useState } from "react";
import { StyleSheet, Text, View, Pressable, RefreshControl, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import InAppNotification from './InAppNotification';
import * as Font from 'expo-font';

export default function App() {
  const [refreshing, setRefreshing] = useState(false);
  const [showNotification, setShowNotification ] = useState(true);
  const [notificationConfig, setNotificationConfig ] = useState({
    boldText: 'Hey Now!',
    regularText: "You're a rock star!",
    progressTime: 0
  })
  const [fontsLoaded, setFontsLoaded ] = useState(false);

  useEffect(() => {
    loadFontsAsync(setFontsLoaded);
  });

  return (
    fontsLoaded 
      ? <ScrollView 
          style={styles.fullScreenScrollViewTop}
          contentContainerStyle={styles.fullScreenScrollView}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh(setShowNotification, setNotificationConfig, setRefreshing)}
            ></RefreshControl>
          }
        >
      
      { showNotification 
        ? <InAppNotification
            boldText={notificationConfig.boldText}
            regularText={notificationConfig.regularText}
            progressTime={notificationConfig.progressTime}
            cancelCallback={notificationCancelled(setShowNotification)}
            key={notificationConfig.date}
          ></InAppNotification>
        : <></>
      }

      <Text style={styles.title}>THE CAR IS ON</Text>
      <Text style={styles.location}>P3</Text>
      <Text style={styles.timestamp}>
        <Text style={styles.timestampText}>Last parked </Text>
        <Text style={styles.timestampValue}>1d ago</Text>
      </Text>

      <View style={styles.buttonCollectionView}>
        <Pressable 
          style={({ pressed }) => [
            pressed ? { opacity: 0.8 } : {},
            styles.buttonPrimaryPressableStyle
          ]} 
          onPress={ () => primaryButtonPress(notificationOpacity, setShowNotification) }
        >
          <View style={ styles.buttonPrimaryView }>
            <FontAwesome name="car" size={24} color="#fff" />
          </View>
          <Text style={ styles.buttonPrimaryTextStyle }>PARK CAR</Text>
        </Pressable>
        <View style={ styles.secondaryButtonView }>
          <Text style={ styles.secondaryButtonUnclickableText }>Or, </Text>
          <Pressable 
            style={({ pressed }) => [
              pressed ? { opacity: 0.8 } : {}
            ]} 
            onPress={ secondaryButtonPress(setShowNotification, setNotificationConfig) }
          >
            <Text style={ styles.secondaryButtonClickableText }>Enter Floor Manually</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
    : <></>
  );
}



export function secondaryButtonPress(setShowNotification, setNotificationConfig) {
  return () => showNewNotification(setShowNotification, setNotificationConfig, {
    boldText: 'Anotha One', 
    regularText: 'DJ Khaled! Father of Assad!',
    progressTime: 5000
  });
}

export async function primaryButtonPress(notificationOpacity, setShowNotification) {
  // DeviceMotion.setUpdateInterval(1000);
  // const isAvailable = await DeviceMotion.isAvailableAsync();
  // if (isAvailable) {
  //   let subscription = DeviceMotion.addListener(res => {
  //     setRotation(`Rotation: ${JSON.stringify(res.rotation)} (rad), rotationRate: ${JSON.stringify(res.rotationRate)} (rad/s).`);
  //     console.log(res);
  //   });
  // }
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

export function notificationCancelled(setShowNotification) {
  return () => setShowNotification(false);
}

export function showNewNotification(setShowNotification, setNotificationConfig, config) {
  setShowNotification(false);
  setImmediate(() => {
    setNotificationConfig(config);
    setShowNotification(true);
  })
}

export function onRefresh(setShowNotification, setNotificationConfig, setRefreshing) {
  return () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);  
      setTimeout(() => {
        showNewNotification(setShowNotification, setNotificationConfig, {
          boldText: 'Hello!',
          regularText: 'This is what is supposed to be shown when we refresh.',
          progressTime: 5000,
        });
      }, 250);
    }, 1000);
  };
}

const styles = StyleSheet.create({
  touchableOpacityStyle: {
    textAlign: 'center',
    borderRadius: 10
  },
  buttonCollectionView: {
    position: 'absolute',
    bottom: 100,
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
