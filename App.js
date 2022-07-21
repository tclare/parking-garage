import { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, Pressable, Animated, Easing } from 'react-native';
import { Inter_900Black, Inter_800ExtraBold, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_200ExtraLight, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { useFonts } from '@expo-google-fonts/inter';
import { FontAwesome } from '@expo/vector-icons';
import InAppNotification from './InAppNotification';
import { DeviceMotion } from 'expo-sensors';

export default function App() {

  const [rotation, setRotation] = useState('-');
  const [showNotification, setShowNotification] = useState(true);
  let notificationOpacity = useRef(new Animated.Value(1)).current;

  let [fontsLoaded] = useFonts({
    Inter_900Black,
    Inter_800ExtraBold,
    Inter_300Light,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_200ExtraLight
  });

  if (!fontsLoaded) return null;

  return (
    <>
      <View style={styles.fullScreenContainer}>

        { showNotification 
          ? <Animated.View 
              style={{
                ... styles.inAppNotificationContainer,
                opacity: notificationOpacity
              }}
            >
              <InAppNotification
                boldText="Success"
                regularText="Car floor updated within parking garage. "
                rotation={rotation}
                cancelCallback={ notificationCancelButtonPressed(notificationOpacity, setShowNotification) }
              ></InAppNotification>
            </Animated.View>
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
              onPress={ secondaryButtonPress }
            >
              <Text style={ styles.secondaryButtonClickableText }>Enter Floor Manually</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </>
  );
}

export function notificationCancelButtonPressed(notificationOpacity, setShowNotification) {
  return () => Animated.timing(notificationOpacity, {
    toValue: 0,
    duration: 500,
    easing: Easing.linear,
    useNativeDriver: true
  }).start(() => setShowNotification(false));
}

export function secondaryButtonPress() {
  console.log('secondary button press')
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
    fontFamily: 'Inter_400Regular',
    letterSpacing: 2,
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#D2E0EF',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative'
  },
  inAppNotificationContainer: {
    position: 'absolute',
    top: 106,
    width: '85%'
  },
  title: {
    fontSize: 20,
    letterSpacing: 2,
    fontFamily: 'Inter_400Regular'
  },
  location: {
    fontSize: 100,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    fontFamily: 'Inter_600SemiBold'
  },
  secondaryButtonClickableText: {
    fontFamily: 'Inter_600SemiBold',
    color: '#3a6ea6',
    fontSize: 16
  },
  secondaryButtonUnclickableText: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16
  },
  secondaryButtonView: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'center'
  },
  timestampText: {
    fontSize: 20,
    fontFamily: 'Inter_200ExtraLight'
  },
  timestampValue: {
    fontFamily: 'Inter_500Medium',
    fontSize: 24
  },
});
