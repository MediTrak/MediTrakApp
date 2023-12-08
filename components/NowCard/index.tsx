import { HStack, VStack } from 'native-base';
import React, { useState } from 'react';
import { View, StyleSheet, Image, Text, Platform, TouchableOpacity } from 'react-native';
import { COLORS } from "../../constants";

type Props = {
    drug?: string | undefined;
    drugTwo?: string | undefined;
    time?: string | undefined;
    noOfTablets?: number | undefined;
    noOfTabletTwo?: number | undefined;
    buttonText?: string | undefined;
    backgroundColor?: string;
    handlePress?: () => void;
};

const NowCard: React.FunctionComponent<Props> = ({ drug, drugTwo, time, noOfTablets, noOfTabletTwo, buttonText, backgroundColor, handlePress }) => {
    return (
        <VStack style={[styles.container, {backgroundColor: backgroundColor}]}>
            <HStack justifyContent={'space-between'} alignItems={'center'} style={{ width: '100%' }}>
                <Text style={{ fontSize: 14, color: COLORS.gray3, textAlign: 'left', fontWeight: '500' }}>{noOfTablets} tablet each</Text>
                <Text style={{ fontSize: 11, color: COLORS.gray3, fontWeight: '600' }}>
                    {time}
                </Text>
            </HStack>
            <View style={{ width: '100%', marginTop: 6 }}>
                <Text style={{ fontSize: 14, color: COLORS.gray3, textAlign: 'left', fontWeight: '500' }}>{drug} and {drugTwo}</Text>
            </View>

            <TouchableOpacity style={styles.button} onPress={handlePress}>
                <Text style={{ fontSize: 12, color: COLORS.primary, textAlign: 'center', fontWeight: '600' }}>{buttonText}</Text>
            </TouchableOpacity>
        </VStack>
    )
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        paddingHorizontal: 20,
        borderColor: '#18305914',
        borderWidth: 1,
        padding: 12,
        borderRadius: 8,
        marginBottom: 10
    },

    button: {
        width: '100%',
        borderColor: '#2A2A2A66',
        borderWidth: 1,
        paddingVertical: 8,
        borderRadius: 4,
        marginTop: 12
    }

})

export default NowCard