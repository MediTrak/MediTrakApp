import { ScrollView, StatusBar, StyleSheet, TouchableOpacity, View, Text, Platform, Image } from 'react-native';
import { Stack, useNavigation } from "expo-router";
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../constants';
import { HStack } from 'native-base';
import { Ionicons } from '@expo/vector-icons';
import BottomSheetComponent from '../../components/BottomSheet';
import { useMemo, useState } from 'react';
// import { Camera, CameraType } from 'expo-camera';

export default function AddEvidence() {
    const navigation = useNavigation();

    const [bottomSheetOpen, setBottomSheetOpen] = useState(false);

    // const [type, setType] = useState(CameraType.back);
    // const [permission, requestPermission] = Camera.useCameraPermissions();

    // function toggleCameraType() {
    //     setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    // }

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
                <Image
                    source={require('../../assets/images/rectangle.png')}
                    style={styles.image}
                />

                {/* <Camera style={styles.image} type={type}>
                    <View>
                        <TouchableOpacity onPress={toggleCameraType}>
                            <Text>Flip Camera</Text>
                        </TouchableOpacity>
                    </View>
                </Camera> */}
            </View>



            <Text style={{ fontSize: 14, color: "#2a2a2a", textAlign: "center", fontWeight: '600', marginTop: 20 }}>Take a selfie</Text>

            <View style={{ width: '100%', paddingHorizontal: 20, marginTop: 20 }}>
                <TouchableOpacity style={styles.loginBtn}
                    onPress={handleToggleBottomSheet}>
                    <Text style={styles.loginBtnText}>Send Photo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.loginBtn, { backgroundColor: '#18305914' }]}
                >
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
        flex: 1
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
});
