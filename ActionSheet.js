import ActionSheet, {
    registerSheet
} from "react-native-actions-sheet";
import { View, Text, StyleSheet } from "react-native";
import ActionSheetButton from './ActionSheetButton';
import { useEffect } from "react";
import * as Font from 'expo-font';

registerSheet("bottom-action-sheet", ActionSheetComponent);

export default function ActionSheetComponent(props) {
    useEffect(() => { loadFontsAsync(); }, []);
    return (
        <ActionSheet 
            id="bottom-action-sheet"
            containerStyle={styles.actionSheet}
        >
        <View style={styles.actionSheetView}>
            <View style={styles.textContainerView}>
                <Text style={styles.title}>Welcome Back!</Text>
                <Text style={styles.subtitle}>Which floor is the car on?</Text>
            </View>
            <View style={styles.actionSheetButtonsView}>
                <ActionSheetButton text="P1" click={props.click}/>
                <ActionSheetButton text="P2" click={props.click}/>
                <ActionSheetButton text="P3" click={props.click}/>
                <ActionSheetButton text="P4" click={props.click}/>
            </View>
        </View>
        </ActionSheet>
    );
}

export async function loadFontsAsync() {
    await Font.loadAsync({
        'Inter-Bold': require('./assets/fonts/Inter-Bold.ttf'),
        'Inter-Regular': require('./assets/fonts/Inter-Regular.ttf'),
        'Inter-Light': require('./assets/fonts/Inter-Light.ttf'),
        'Inter-Extra-Light': require('./assets/fonts/Inter-ExtraLight.ttf')    
    });
}


const styles = StyleSheet.create({
    actionSheet: {
        height: 250,
        paddingTop: 10,
        paddingBottom: 100,
        paddingHorizontal: 50,
    },
    actionSheetButtonsView: {
        padding: 10
    },
    actionSheetView: {
        display: 'flex',
        paddingBottom: 25,
        justifyContent: 'space-around',
        height: '100%'
    },
    textContainerView: {
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    actionSheetButtonsView: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    title: {
        fontFamily: 'Inter-Bold',
        fontSize: 30
    },
    subtitle: {
        fontFamily: 'Inter-Light',
        letterSpacing: 2
    }
})