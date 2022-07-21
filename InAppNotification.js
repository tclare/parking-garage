import { StyleSheet, Text, View, Pressable } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { useFonts } from '@expo-google-fonts/inter';
import { Inter_900Black, Inter_800ExtraBold, Inter_300Light, Inter_400Regular, Inter_500Medium, Inter_200ExtraLight, Inter_600SemiBold } from '@expo-google-fonts/inter';

export default function InAppNotification(props) {
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

    return <>
        <View style={ styles.topLevelView }>
            <View style={ styles.colorWallAndTextView }>
                <View style={ styles.boldColorWall}></View>
                <Text style={ styles.notificationTextView }>
                    <Text style={ styles.notificationTextBold }>{props.boldText}: </Text>
                    <Text style={ styles.notificationTextRegular }>{props.regularText}</Text>
                </Text>
            </View>
            <View style={ styles.cancelButtonView }>
                {/* <ActivityIndicator size="small" color="black"></ActivityIndicator> */}
                <Pressable 
                    style={({ pressed }) => [
                        pressed ? { opacity: 0.8 } : {}
                    ]} 
                    onPress={ props.cancelCallback }
                >
                    <FontAwesome name="close" size={24} color="black" />
                </Pressable>
            </View>
        </View>
    </>
}


/* Suggested props: 
    - boldText (string)
    - regularText (string)
    - dismissable (if true, waits or user to dismiss, and progress time is required. if not, dismisses as soon as a progress bar is over)
    - progressTime (
        if t <= 0, no progress time, just show X. 
        else if 0 < t < Infinity, create a progress spinner waiting t milliseconds.
        else if t = Infinity, create a spinner that will load infinitely. Some other source (maybe an
        inline link or something) will dismiss the notification.
    )
*/


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
        paddingRight: 30
    }
})