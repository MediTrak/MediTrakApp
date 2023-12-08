import { HStack, VStack } from 'native-base';
import React, { useEffect, useState, useRef } from 'react';
import { View, StyleSheet, Image, Text, Platform, TouchableOpacity, Alert, Modal, Pressable } from 'react-native';
import { COLORS } from "../../constants";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Popover, { PopoverPlacement } from 'react-native-popover-view';


type Props = {
    id?: string | undefined;
    drug: string | undefined;
    noOfTablets: number | string | undefined;
    backgroundColor?: string | undefined;
    textColor?: string | undefined;
    onModalOpen?: () => void;
    onEditPress?: () => void;
    onSharePress?: () => void;
    onDeletePress?: () => void;
    onModalClose?: () => void;
    modalVisible: boolean;
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
    modalVisible
}) => {

    const router = useRouter();
    const touchable = useRef();
    const [showPopover, setShowPopover] = useState(false);


    useEffect(() => {
    }, [modalVisible]);

    return (
        <VStack style={styles.container}>
            <HStack justifyContent={'space-between'} alignItems={'center'} style={{ width: '100%' }}>
                <Text style={{ fontSize: 16, color: COLORS.gray3, textAlign: 'left', fontWeight: '500' }}>{drug} </Text>

                <TouchableOpacity
                    onPress={onModalOpen}
                >
                    <MaterialCommunityIcons name='dots-vertical' size={24} />
                </TouchableOpacity>

            </HStack>

            <HStack style={{ marginTop: 8 }}>
                <View style={[styles.coloredText, { backgroundColor: backgroundColor }]}>
                    <Text style={{ color: textColor, fontSize: 13, fontWeight: "600" }}>{noOfTablets} Daily</Text>
                </View>
            </HStack>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={onModalClose}
                key={id}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <View style={styles.cancelContainer}>
                            <TouchableOpacity onPress={onModalClose}>
                                <MaterialCommunityIcons name='close' size={24} />
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
                </View>
            </Modal>
        </VStack>
    );
};


const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        borderColor: '#2A2A2A12',
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
        marginBottom: 20
    },

    coloredText: {
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 112,
    },

    centeredView: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 50,
        // borderColor: 'red',
        // borderWidth: 1
    },
    modalView: {
        margin: 20,
        paddingVertical: 10,
        backgroundColor: 'white',
        borderRadius: 20,
        alignItems: 'flex-start',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '70%',
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
        marginVertical: 10
    },

    cancelContainer: {
        width: '100%',
        alignItems: 'flex-end',
        paddingRight: 20
    },

    textPress: {
        width: '100%',
    }

})

export default PlanDrugCard;