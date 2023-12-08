import React from 'react';
import { Platform, StatusBar, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import CreateAccountLoader from '../../Loaders/CreateAccountLoader';
import { COLORS } from "../../../constants";

const CreateAccountLoaderScreen = () => {

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0, backgroundColor: COLORS.white }}>
            <CreateAccountLoader />
            <Text style={styles.text}>
                Creating your Account
            </Text>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    text: {
        fontSize: 14,
        lineHeight: 21,
        color: COLORS.gray2,
        fontWeight: '600',
        textAlign: 'center',
    },
})
export default CreateAccountLoaderScreen