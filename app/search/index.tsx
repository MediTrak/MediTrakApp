import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, Text, Platform, Image, Linking, TextInput, NativeSyntheticEvent, TextInputChangeEventData, Pressable } from 'react-native';
import { Stack, useNavigation } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import { HStack, Icon } from 'native-base';
import { AntDesign, Ionicons } from '@expo/vector-icons';



export default function Search() {
    const navigation = useNavigation();

    const [formData, setFormData] = useState({ search: '' });

    const { search } = formData;

    const [errors, setErrors] = useState({
        search: '',
    });

    const validateInputs = () => {
        let validationPassed = true;
        const newErrors = { search: '', };

        if (!search.trim()) {
            newErrors.search = 'Enter search query';
            validationPassed = false;
        }

        setErrors(newErrors);
        return validationPassed;
    };

    const handleChangeInput = (name: string, e: NativeSyntheticEvent<TextInputChangeEventData>) => {
        const value = e.nativeEvent.text;
        setFormData({ ...formData, [name]: value });
        setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0, paddingBottom: 20 }}>
            {/* <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" /> */}
            <HStack style={styles.header} space={2} alignItems={'center'}>
                <TouchableOpacity>
                    <Ionicons name="chevron-back-outline" size={24} color={COLORS.primary}
                        onPress={navigation.goBack} />
                </TouchableOpacity>
                <Text style={styles.title}>Search</Text>
            </HStack>

            <View style={{ paddingHorizontal: 20, flex: 1, width: '100%'}}>
                <View style={styles.innerContainers}>
                    <View style={styles.inputContainer}>
                        <TextInput
                            placeholder="Search for anything"
                            nativeID="search"
                            onChange={(value) => handleChangeInput('search', value)}
                            style={styles.textInput}
                            underlineColorAndroid="transparent"
                            placeholderTextColor="#2A2A2A24"
                        />
                        <Pressable>
                            < Icon as={<AntDesign name="search1" />} size={5} color="#2A2A2ACC" />
                        </Pressable>
                    </View>
                    <HStack alignItems={'center'} style={{ minHeight: 18 }}>
                        {errors.search && <Text style={styles.errorText}>{errors.search}</Text>}
                    </HStack>
                </View>
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

    innerContainers: {
        width: '100%',
    },

    textInput: {
        fontSize: 14,
        flex: 1,
    },

    inputContainer: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: "#2A2A2A24",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        width: '100%',
        paddingVertical: 8,
        height: 40
    },

    errorText: {
        color: 'red',
        fontSize: 12,
        textAlign: 'left',
    }
});