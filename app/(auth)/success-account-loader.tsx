import React, { useEffect } from 'react';
import { Platform, StatusBar, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import SuccessAccountLoader from '../../components//Loaders/SuccessAccountLoader';
import { COLORS } from "../../constants";
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';

const SuccessfulAccountLoaderScreen = () => {

    const router = useRouter();

    const params = useLocalSearchParams();

    const { user } = useLocalSearchParams();

    const navigation = useNavigation();

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            // Alert.alert("Cannot go back from here. Sign in again")
            navigation.dispatch(e.data.action);
        });
    }, []);

    useEffect(() => {
        const handleBackPress = () => {
            BackHandler.exitApp();
            return true;
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, []); // Empty dependency array means this effect runs once

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0, backgroundColor: COLORS.white, paddingHorizontal: 20 }}>
            <SuccessAccountLoader />
            <Text style={styles.text}>
                Account Created
            </Text>

            <TouchableOpacity style={styles.loaderBtn}
              onPress={() => {
                router.push({ pathname: "/accountability-partners", params: { user: user } });
              }}
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