import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, View, Pressable, Easing, ActivityIndicator } from "react-native";
import { useFonts } from '@expo-google-fonts/inter';
import { Inter_900Black, Inter_800ExtraBold, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_200ExtraLight, Inter_600SemiBold } from '@expo-google-fonts/inter';
import * as Progress from 'react-native-progress';
import { FontAwesome } from '@expo/vector-icons';


export default function InAppNotification(props) {
    let notificationOpacity = useRef(new Animated.Value(1)).current;
    let notificationTop = useRef(new Animated.Value(
        props.animateIn === false ? 106 : 0
    )).current;
    let [progressCircleProgress, setProgressCircleProgress] = useState(0);
    let [fontsLoaded] = useFonts({
        Inter_900Black,
        Inter_800ExtraBold,
        Inter_300Light,
        Inter_400Regular,
        Inter_500Medium,
        Inter_600SemiBold,
        Inter_200ExtraLight
    });

    useEffect(() => {
        let progressCircleAnimationInterval, millisecondsElapsed = 0;
        // props.eventEmitter.addListener('refresh', () => {
        //     console.log('how about that refresh?')
        // });
        Animated.timing(notificationTop, {
            toValue: 106,
            duration: 500,
            easing: Easing.linear,
            useNativeDriver: false
        }).start(() => {
            if (props.progressTime > 0 && props.progressTime < Infinity) {
                progressCircleAnimationInterval = setInterval(() => {
                    if (millisecondsElapsed >= props.progressTime) {
                        clearInterval(progressCircleAnimationInterval); 
                        phaseNotificationOut(notificationOpacity, props.cancelCallback)();
                        return;
                    }
                    millisecondsElapsed += 50;
                    setProgressCircleProgress(millisecondsElapsed / props.progressTime);
                }, 50)
            }
        });
        return () => {
            clearInterval(progressCircleAnimationInterval);
        };
    }, [])

    if (!fontsLoaded) return null;

    return <>
        <Animated.View style={{ 
            ... styles.topLevelView,
            opacity: notificationOpacity,
            top: notificationTop
        }}>
            <View style={ styles.colorWallAndTextView }>
                <View style={ styles.boldColorWall}></View>
                <Text style={ styles.notificationTextView }>
                    <Text style={ styles.notificationTextBold }>{props.boldText} </Text>
                    <Text style={ styles.notificationTextRegular }>{props.regularText}</Text>
                </Text>
            </View>
            <View style={ styles.cancelButtonView }>
                {
                    props.progressTime <= 0 
                        ? <Pressable 
                            style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}]} 
                            onPress={ phaseNotificationOut(notificationOpacity, props.cancelCallback) }
                        >
                            <FontAwesome name="close" size={24} color="black" />
                        </Pressable>
                    : props.progressTime < Infinity
                        ?  <Progress.Circle 
                            size={20}
                            thickness={2}
                            duration={100}
                            progress={progressCircleProgress}
                        ></Progress.Circle>
                    : <ActivityIndicator size="small" color="black"></ActivityIndicator>
                }
            </View>
        </Animated.View>
    </>
}

export function phaseNotificationOut(notificationOpacity, cancelCallback) {
    return () => Animated.timing(notificationOpacity, {
      toValue: 0,
      duration: 500,
      easing: Easing.linear,
      useNativeDriver: false
    }).start(cancelCallback);
}


const styles = StyleSheet.create({
    boldColorWall: {
        width: 5,
        height: '100%',
        backgroundColor: '#3A6EA6',
        borderRadius: 5,
        marginRight: 10,
    },
    cancelButtonView: {
        height: '100%',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    colorWallAndTextView: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%'
    },
    notificationText: {
        fontSize: 18,
        fontFamily: 'Inter_400Regular'
    },
    notificationTextBold: {
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold'
    },
    notificationTextRegular: {
        fontSize: 18
    },
    notificationTextView: {
        width: '90%'
    },
    topLevelView: {
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        shadowColor: '#000',
        backgroundColor: '#B4CBE4',
        paddingVertical: 10,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.5,
        shadowRadius: 2,  
        elevation: 5,
        paddingRight: 30,
        position: "absolute",
        width: "85%"
    }
})