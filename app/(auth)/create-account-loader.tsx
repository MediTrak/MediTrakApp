import React, { useEffect } from 'react';
import { Platform, StatusBar, Text, StyleSheet, TouchableOpacity, BackHandler } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import CreateAccountLoader from '../../components/Loaders/CreateAccountLoader';
import { COLORS } from "../../constants";
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';

const CreateAccountLoaderScreen = () => {

    const router = useRouter();

    const params = useLocalSearchParams();

    const { resp } = useLocalSearchParams();

    const navigation = useNavigation();

    useEffect(() => {
        navigation.addListener('beforeRemove', (e) => {
            e.preventDefault();
            // Alert.alert("Cannot go back from here. Sign in again")
            navigation.dispatch(e.data.action);
        });
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {

        }, 8000);
        // router.push("/success-account-loader");

        router.push({ pathname: "/success-account-loader", params: { user: resp } });
        return () => {
            // clear timeout when the component unmounts
            clearTimeout(timeout);
        };
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