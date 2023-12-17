import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, Text, Platform, Image, Linking } from 'react-native';
import { Stack, useNavigation } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import { HStack } from 'native-base';
import { Ionicons } from '@expo/vector-icons';



export default function AddEvidence() {
    const navigation = useNavigation();

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0, paddingBottom: 20 }}>
            {/* <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" /> */}
            <HStack style={styles.header} space={2} alignItems={'center'}>
                <TouchableOpacity>
                    <Ionicons name="chevron-back-outline" size={24} color={COLORS.primary}
                        onPress={navigation.goBack} />
                </TouchableOpacity>
                <Text style={styles.title}>Notifications</Text>
            </HStack>

            <View style={{ paddingHorizontal: 20, flex: 1, width: '100%' }}>


            </View>

        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    header: {
        width: '100%',
        paddingHorizontal: 12,
        marginBottom: 20,
        marginTop: Platform.OS == "ios" ? 10 : 0
    },

    title: {
        fontSize: 18,
        lineHeight: 27,
        fontWeight: "600",
        color: COLORS.gray3,
        textAlign: "left"
    },
});