import React, { useEffect } from 'react';
import { Platform, StatusBar, Text, StyleSheet, TouchableOpacity, Image, View, BackHandler } from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import { COLORS } from "../../constants";
import { useNavigation, useRouter } from "expo-router";

const NotificationSent = () => {

    const router = useRouter();

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
            <View>
                <Image
                    source={require('../../assets/images/EllipseNot.png')}
                    style={{ width: 164, height: 164, marginBottom: 20 }}
                />
            </View>
            <Text style={styles.text}>
                Notification Sent
            </Text>

            <Text style={styles.subText}>
                An email has been sent to the provided {'\n'} contact detail
            </Text>

            <TouchableOpacity style={styles.loaderBtn}
                onPress={() => {
                    router.push("/(tabs)/home");
                }}
            >
                <Text style={styles.loaderBtnText}>Go to Home</Text>
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
    subText: {
        color: COLORS.gray2,
        fontSize: 14,
        lineHeight: 21,
        fontWeight: "500",
        textAlign: 'center',
        width: '100%',
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

export default NotificationSent;
