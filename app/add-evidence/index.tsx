import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, Text, Platform, Image, Linking } from 'react-native';
import { Stack, useNavigation } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import { HStack } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import BottomSheetComponent from '../../components/BottomSheet';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Camera, useCameraDevice, useCameraDevices } from 'react-native-vision-camera';

export default function AddEvidence() {
    const navigation = useNavigation();

    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

    const camera = useRef<Camera>(null)
    const device = useCameraDevice('back')

    const [showCamera, setShowCamera] = useState(false);
    const [imageSource, setImageSource] = useState('');

    useEffect(() => {
        async function getPermission() {
            const newCameraPermission = await Camera.requestCameraPermission();
            setShowCamera(true)
            console.log('see camera permission:', newCameraPermission );
        }
        getPermission();
    }, []);

    const capturePhoto = async () => {
        if (camera.current !== null) {
            const photo = await camera.current.takePhoto({
                flash: 'auto'
            });
            setImageSource(photo.path);
            setShowCamera(false);
            console.log(photo.path);
        }
    };

    if (device == null) {
        return <Text>No camera detected</Text>
    }

    // variables
    const snapPoints = useMemo(() => ['50%'], []);

    // handlers
    const handleToggleBottomSheet = () => {
        setBottomSheetOpen(prevState => !prevState);
    };

    return (
        <SafeAreaView style={{ flex: 1, justifyContent: "flex-start", alignItems: "center", paddingTop: Platform.OS == "android" ? StatusBar.currentHeight : 0, paddingBottom: 20 }}>
            {/* <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" /> */}
            <HStack style={styles.header} space={2} alignItems={'center'}>
                <TouchableOpacity>
                    <Ionicons name="chevron-back-outline" size={24} color={COLORS.primary}
                        onPress={navigation.goBack} />
                </TouchableOpacity>
                <Text style={styles.title}>Add Evidence</Text>
            </HStack>

            <View style={{ paddingHorizontal: 20, flex: 1, width: '100%' }}>
                {showCamera || imageSource == '' ? (
                    <>
                        <Camera
                            ref={camera}
                            style={styles.image}
                            device={device}
                            isActive={showCamera}
                            photo={true}
                        />

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={styles.camButton}
                                onPress={() => capturePhoto()}
                            />
                        </View>
                    </>
                ) : (
                    <>
                        {imageSource !== '' ? (
                            <Image
                                style={styles.image}
                                source={{
                                    uri: `file://'${imageSource}`,
                                }}
                            />
                        ) : null}
                    </>
                )}

            </View>

            <Text style={{ fontSize: 14, color: "#2a2a2a", textAlign: "center", fontWeight: '600', marginTop: 20 }}>Take Picture Evidence</Text>

            <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 20 }}>
                <TouchableOpacity style={styles.loginBtn}
                    onPress={handleToggleBottomSheet}>
                    <Text style={styles.loginBtnText}>Send Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.loginBtn, { backgroundColor: '#18305914' }]}
                onPress={() => setShowCamera(true)}>
                    <Text style={[styles.loginBtnText, { color: COLORS.primary }]}>Retake Photo</Text>
                </TouchableOpacity>
            </View>

            <BottomSheetComponent
                initialIndex={bottomSheetOpen ? 0 : -1}
                snapPoints={snapPoints}
            >
                <View style={styles.contentContainer}>
                    <Image
                        source={require('../../assets/images/evidence.png')}
                        style={{ width: 164, height: 164 }}
                    />
                    <Text style={styles.proofText}>Proof sent to accountability partners.</Text>
                </View>
            </BottomSheetComponent>

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

    image: {
        width: '100%',
        objectFit: 'fill',
        flex: 1,
        borderRadius: 8
    },

    loginBtn: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: COLORS.primary,
        width: '100%',
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 8,
    },

    loginBtnText: {
        fontSize: 14,
        lineHeight: 21,
        color: COLORS.white,
        fontWeight: '600'
    },

    contentContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    proofText: {
        fontSize: 14,
        lineHeight: 21,
        color: COLORS.primary,
        fontWeight: '600',
        textAlign: 'center'
    },
    buttonContainer: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        bottom: 0,
        left: 20,
        padding: 10,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    camButton: {
        height: 80,
        width: 80,
        borderRadius: 40,
        //ADD backgroundColor COLOR GREY
        backgroundColor: '#B2BEB5',

        alignSelf: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    backButton: {
        backgroundColor: 'rgba(0,0,0,0.0)',
        position: 'absolute',
        justifyContent: 'center',
        width: '100%',
        top: 0,
        padding: 20,
    },
});
