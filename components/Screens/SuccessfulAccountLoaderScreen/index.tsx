import React from 'react';
import { Platform, StatusBar, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import SuccessAccountLoader from '../../Loaders/SuccessAccountLoader';
import { COLORS } from "../../../constants";

const SuccessfulAccountLoaderScreen = () => {

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0, backgroundColor: COLORS.white, paddingHorizontal: 20 }}>
            <SuccessAccountLoader />
            <Text style={styles.text}>
                Account Created
            </Text>

            <TouchableOpacity style={styles.loaderBtn}
            //   onPress={handleSubmit}
            >
                <Text style={styles.loaderBtnText}>Personalize your Experience</Text>
            </TouchableOpacity>
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
        marginBottom: 20
    },
    loaderBtn: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: COLORS.primary,
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },
    loaderBtnText: {
        fontSize: 14,
        lineHeight: 21,
        color: COLORS.white,
        fontWeight: '600'
    },
})
export default SuccessfulAccountLoaderScreen