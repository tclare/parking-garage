import { Pressable, StyleSheet, Text, View } from "react-native";
import { useEffect } from "react";
import * as Font from 'expo-font';


export default function ActionSheetButton(props) {
    useEffect(() => { loadFontsAsync(); }, []);
    return (
        <Pressable
            style={({ pressed }) => [ pressed ? { opacity: 0.8 } : {}]} 
            onPress={ props.click(props.text) }
        >
            <View 
                style={{ 
                    ... styles.view, 
                    backgroundColor: computeBackgroundColor(props.text)
                }}
            >
                <Text style={styles.text}>{props.text}</Text>
            </View>
        </Pressable>
    )
}

export function computeBackgroundColor(carFloor) {
    return carFloor === 'P1'
        ? '#3a6ea6'
        : carFloor === 'P2'
        ? '#4078b5'
        : carFloor === 'P3'
        ? '#4A83BF'
        : '#598DC5'
}

export async function loadFontsAsync(setFontsLoaded) {
    await Font.loadAsync({
      'Inter-Extra-Bold': require('./assets/fonts/Inter-Bold.ttf'),
    });
}

const styles = StyleSheet.create({
    view: {
        width: 75,
        height: 75,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: "50%",
    },
    text: {
        color: '#fff',
        fontSize: 20,
        fontFamily: 'Inter-Extra-Bold',
    }
});

