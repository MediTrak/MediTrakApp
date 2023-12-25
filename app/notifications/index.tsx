import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, Text, Platform, Image, Linking } from 'react-native';
import { Stack, useNavigation } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import { HStack } from 'native-base';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import NotificationCard from '../../components/NotificationCard';
import { FlashList } from '@shopify/flash-list';



export default function Notifications() {
    const navigation = useNavigation();

    const [checked, setChecked] = useState<{ [id: string]: boolean }>({});

    const [showDelete, setShowDelete] = useState(false);

    const handleChecked = (id: string) => {
        setChecked((prev) => {
            const updatedChecks = { ...prev };

            // Toggle the value of the current modal's state
            updatedChecks[id] = !updatedChecks[id];

            return updatedChecks;
        });
    };

    useEffect(() => {
        const hasTrueValue = Object.values(checked).some((value) => value);

        // Update showDelete accordingly
        setShowDelete(hasTrueValue);
    }, [checked]);

    const handleDelete = () => {
        console.log('notification deleted for checked ids:');
    };

    const notificationData = [
        {
            id: '1',
            notification: 'MediTrak',
            desc: 'Welcome to Meditrak',
            time: '2pm'
        },
        {
            id: '2',
            notification: 'MediTrak',
            desc: 'Welcome to Meditrak',
            time: '2pm'
        },
        {
            id: '3',
            notification: 'MediTrak',
            desc: 'Welcome to Meditrak',
            time: '2pm'
        },
        {
            id: '4',
            notification: 'MediTrak',
            desc: 'Welcome to Meditrak',
            time: '2pm'
        },
        {
            id: '5',
            notification: 'MediTrak',
            desc: 'Welcome to Meditrak',
            time: '2pm'
        }
    ]; //mock notification data to be changed

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0, paddingBottom: 20 }}>
            {/* <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" /> */}
            <HStack style={styles.header} alignItems={'center'} justifyContent={'space-between'}>
                <HStack space={2}>
                    <TouchableOpacity>
                        <Ionicons name="chevron-back-outline" size={24} color={COLORS.primary}
                            onPress={navigation.goBack} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Notifications</Text>
                </HStack>
                {showDelete && (
                    <TouchableOpacity onPress={handleDelete}>
                        <AntDesign name="delete" size={20} color="#DD2E44" />
                    </TouchableOpacity>

                )}
            </HStack>

            <View style={{ paddingHorizontal: 20, flex: 1, width: '100%' }}>

                <FlashList
                    data={notificationData}
                    keyExtractor={(item) => item.id}
                    showsVerticalScrollIndicator={false}
                    // contentContainerStyle={{ padding: 20 }}
                    renderItem={({ item, index }: { item: any, index: number }) => (
                        <NotificationCard
                            notification={'Meditrak'}
                            desc='Welcome to Meditrak!'
                            time={'2pm'}
                            handleChecked={() => handleChecked(item.id)}
                        />
                    )}
                    estimatedItemSize={200}
                    extraData={checked}
                />

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