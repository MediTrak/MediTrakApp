import { HStack, VStack } from 'native-base';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Image, Text, Platform, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import { COLORS, SHADOWS } from "../../constants";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';


type Props = {
    id?: string | undefined;
    drug: string | undefined;
    noOfTablets: number | string | undefined;
    backgroundColor?: string | undefined;
    textColor: string | undefined;
    onModalOpen: () => void;
    onEditPress: () => void;
    onSharePress: () => void;
    onDeletePress: () => void;
    onModalClose: () => void;
    modalVisible: boolean;
    startDate?: string;
    endDate?: string;
    dosage: string;
    item: any;
};

const PlanDrugCard: React.FunctionComponent<Props> = ({
    drug,
    noOfTablets,
    backgroundColor,
    textColor,
    id,
    onModalOpen,
    onEditPress,
    onSharePress,
    onDeletePress,
    onModalClose,
    modalVisible,
    startDate,
    endDate,
    dosage,
    item
}) => {

    const router = useRouter();
    const [showPopup, setShowPopup] = useState(modalVisible);
    // const [state, setState] = useState(message)

    const Popup = () => {
        return (
            <View style={styles.modalView} key={id}>
                <View style={styles.cancelContainer}>
                    <TouchableOpacity onPress={onModalClose}>
                        <MaterialCommunityIcons name='close' size={20} />
                    </TouchableOpacity>
                </View>

                {onEditPress && (
                    <TouchableOpacity style={styles.textPress} onPress={onEditPress}>
                        <Text style={styles.titleText}>Edit</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.divider} />

                {onSharePress && (
                    <TouchableOpacity style={styles.textPress} onPress={onSharePress}>
                        <Text style={styles.titleText}>Share</Text>
                    </TouchableOpacity>
                )}

                <View style={styles.divider} />

                {onDeletePress && (
                    <TouchableOpacity style={styles.textPress} onPress={onDeletePress}>
                        <Text style={[styles.titleText, { color: '#DD2E44' }]}>Delete</Text>
                    </TouchableOpacity>
                )}
            </View>
        )
    }


    useEffect(() => {
        // setState(message)
        setShowPopup(modalVisible)
    }, [modalVisible]);

    return (
        <VStack style={styles.container} key={id}>
            {modalVisible && (
                <Popup key={id} />
            )}
            <HStack justifyContent={'space-between'} alignItems={'center'} style={{ width: '100%' }}>
                <Text style={{ fontSize: 16, color: COLORS.primary, textAlign: 'left', fontWeight: '500' }}>{drug}</Text>

                <TouchableOpacity
                    onPress={onModalOpen}
                // onPress={updateMessage}
                >
                    <MaterialCommunityIcons name='dots-vertical' size={24} />
                </TouchableOpacity>

            </HStack>

            <HStack style={{ marginTop: 8 }}>
                <View style={[styles.coloredText, { backgroundColor: backgroundColor }]}>
                    <Text style={{ color: textColor, fontSize: 13, fontWeight: "600" }}>{dosage} {dosage === "1" ? "tablet" : "tablets"} {noOfTablets === 1 ? '' : noOfTablets} {noOfTablets === 1 ? 'Once' : 'Times'} Daily</Text>
                </View>
            </HStack>

            {/* <HStack style={{ marginTop: 10, marginRight: 12 }} justifyContent={'space-between'}>
                <Text style={{ color: COLORS.gray3, fontSize: 14, fontWeight: "500" }}>Start: {startDate}</Text>
                <Text style={{ color: COLORS.gray3, fontSize: 14, fontWeight: "500" }}>End: {endDate}</Text>
            </HStack> */}

        </VStack>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        borderColor: '#2A2A2A12',
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
        marginBottom: 20,
        ...SHADOWS.medium,
        shadowColor: COLORS.white,
        elevation: 3,
        shadowOffset: {
            width: 0,
            height: 2,
        }, 
    },

    coloredText: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 112,
    },

    modalView: {
        paddingVertical: 10,
        backgroundColor: COLORS.lightWhite,
        borderRadius: 8,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 3,
        width: '30%',
        position: 'absolute',
        zIndex: 5,
        // borderColor: 'red',
        // borderWidth: 1,
        right: 50,
        top: 20,
    },

    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },

    titleText: {
        fontSize: 18,
        lineHeight: 21,
        color: COLORS.gray3,
        fontWeight: '500',
        textAlign: 'left',
        paddingLeft: 10
    },

    divider: {
        width: '100%',
        borderColor: '#F9F9F9',
        borderWidth: 1,
        marginVertical: 8
    },

    cancelContainer: {
        width: '100%',
        alignItems: 'flex-end',
        paddingRight: 10
    },

    textPress: {
        width: '100%',
    }

})

export default PlanDrugCard;